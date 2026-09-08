# Research: Admin panel auth + database

Date: 2026-09-08

## Q1 — Is NextAuth.js the right "something like NextAuth" today?

**Finding**: Auth.js v5 (the NextAuth.js rewrite) is still on the beta
release tag as of mid-2026 — `next-auth@latest` still resolves to the old
v4. Separately, **Vercel acquired Better Auth on 2026-07-07** (announced on
Vercel's own blog); Better Auth stays MIT/open-source, same team, same
name, now Vercel-backed. Better Auth already has ~4.7M weekly npm
downloads and 850+ contributors pre-acquisition.

**Implication**: recommend **Better Auth**, not NextAuth/Auth.js, for a
new project in 2026 — same "modern auth library" category the user asked
for, without the multi-year beta-limbo, and backed by the same platform
(Vercel) this project deploys to.

**Confidence**: High.

**Sources**:
- https://vercel.com/blog/vercel-acquires-better-auth
- https://www.wisp.blog/blog/lucia-auth-is-dead-whats-next-for-auth

## Q2 — What database/ORM fits a Vercel-deployed Next.js app in 2026?

**Finding**: "Vercel Postgres" was discontinued (wound down Q4 2024–Q1
2025); existing instances were migrated to **Neon**, which is Vercel's
current recommended Postgres provider (connects directly from the Vercel
dashboard). Neon itself was acquired by Databricks in May 2025 — prices
went down post-acquisition (storage ~80% cheaper, free tier doubled). For
the ORM, **Drizzle** is the option Vercel itself points teams toward for
serverless/edge deployments: ~33KB bundle, no separate query-engine
binary, faster cold starts than Prisma, and Better Auth ships a
first-party Drizzle adapter.

**Implication**: **Neon (Postgres) + Drizzle ORM**. Both have workable
free tiers for this project's scale.

**Confidence**: High.

**Sources**:
- https://layerbase.com/blog/best-database-for-nextjs-vercel
- https://anotherwrapper.com/blog/drizzle-vs-prisma

**Resolved (user decision, 2026-09-08)**: user prefers **Supabase**
Postgres over Neon — both were listed as valid options in this research;
Supabase is not a downgrade, just a different provider with the same
Drizzle-ORM approach. Connect via the `postgres-js` driver
(`drizzle-orm/postgres-js` + `postgres` npm package), using Supabase's
**connection pooler URL** (port 6543, `pooler.supabase.com`) with
`prepare: false` (required for pgBouncer) — not the direct DB URL, which
doesn't handle serverless connection churn well. Verified via Drizzle's
own Supabase integration docs (https://orm.drizzle.team/docs/connect-supabase).
Better Auth's Drizzle adapter is unaffected by this swap — it talks to
whatever Drizzle client it's given.

## Q3 — Can Better Auth's public sign-up be disabled (single pre-seeded admin, no open registration)?

**Finding**: Better Auth's own docs do not document a built-in "disable
sign-up" flag — `emailAndPassword.enabled: true` is what turns on both
sign-in and the auto-generated sign-up endpoints together, and the
Next.js integration mounts every auth endpoint through one catch-all
route handler (`/api/auth/[...all]/route.ts`).

**Implication**: cannot rely on an undocumented library switch. Design
decision: wrap that catch-all handler to reject the sign-up path
ourselves before delegating to Better Auth (defense-in-depth, testable),
and create the one admin user via a one-off seed script that calls
Better Auth's server-side API directly — never through a public form.

**Confidence**: Medium — based on the docs actually available; Better
Auth ships plugins frequently, so a dedicated "admin" or "sign-up
disabled" plugin may exist that this search didn't surface. Worth a
second look at implementation time, but the handler-guard approach is
correct and safe regardless.

**Sources**:
- https://better-auth.com/docs/adapters/drizzle
- https://better-auth.com/docs/integrations/next
