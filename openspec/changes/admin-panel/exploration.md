## Exploration: Admin panel with authenticated course management

### Current State

Course data lives as git-committed JSON under `content/courses/{platform}/*.json`
(`src/lib/courses/read.ts`, `src/lib/courses/schema.ts`), validated with Zod
and read at build time for fully static (SSG) rendering — no database, no
server-side mutable state, no auth of any kind. `scripts/sync-youtube.ts`
writes new JSON files, delivered through a PR (`.github/workflows/sync-youtube.yml`)
so a human reviews every new/updated record before it's live. Udemy records
are added by hand the same way. This was a deliberate decision
(`openspec/changes/course-catalog-mvp/design.md` — Decision: Content storage)
made specifically to avoid infra/hosting cost and keep git as the single
source of truth with review built in.

### Affected Areas

- `src/lib/courses/schema.ts`, `read.ts` — course records move from
  filesystem JSON to a database-backed model.
- `src/app/page.tsx`, `[category]/page.tsx`, `[category]/[slug]/page.tsx` —
  switch from filesystem reads to DB reads; rendering strategy changes
  from pure SSG to ISR with on-demand revalidation (so admin edits show up
  without a full redeploy).
- `scripts/sync-youtube.ts` — target changes from writing JSON files to
  writing DB rows.
- New: `src/app/admin/**` (login + CRUD UI), auth config, DB schema/client,
  migration script for the one existing committed course record.
- `openspec/changes/course-catalog-mvp/design.md` — this change reverses
  its "no database" decision; the delta specs here modify, not replace,
  the prior course-catalog spec.

### User-fixed decisions (from chat)

1. Auth library: **Better Auth** — chosen after live research (see
   `research.md`): NextAuth/Auth.js v5 is still unreleased-beta as of
   mid-2026 (`next-auth@latest` still resolves to v4), while Better Auth
   was acquired by Vercel in July 2026, stays MIT/open-source, and is
   actively developed.
2. Persistence: **migrate to a real database** (not GitHub-API commits) —
   user explicitly chose this over keeping git as the source of truth, to
   get instant (non-deploy-gated) admin edits.

### Approaches for the database itself

1. **Neon Postgres + Drizzle ORM (recommended)** — Neon is Vercel's
   recommended Postgres provider since Vercel's own Postgres offering was
   discontinued (2024–2025, existing instances migrated to Neon); Drizzle
   is the lighter, edge/serverless-friendly ORM Vercel itself recommends
   over Prisma for this kind of deployment (smaller bundle, no separate
   query-engine binary, faster cold starts). Free tier fits this project.
   - Pros: matches current Vercel-ecosystem guidance; Better Auth ships a
     first-class Drizzle adapter; SQL-level control.
   - Cons: one more external account/service (Neon) to provision.
   - Effort: Medium.
2. **Vercel/Supabase/PlanetScale alternatives** — all viable, all add the
   same category of external dependency; no material advantage over Neon
   for this project's scale, and Neon is the one Vercel itself points at
   post-Postgres-sunset.
   - Effort: Medium (same shape as #1, no reason to prefer it here).

### Approach for keeping editorial review after removing git-as-gate

Moving off git/PR removes the review step that `content-ingestion`
(course-catalog-mvp) relies on for the YouTube sync job. Recommended:
give course rows a `status` (`pending` | `published`); the sync job always
inserts as `pending`, and the admin panel is where a human flips a row to
`published`. This preserves "a human looks before it's live" without git.

### Rendering strategy

Public pages currently prerender fully at build time. With a mutable DB,
recommend ISR + `revalidateTag`/`updateTag` (Next.js 16 `next/cache` APIs)
fired from the admin panel's server actions, so an edit is visible
immediately without waiting for a redeploy — this is exactly the "read
your writes" use case those APIs document.

### Risks

- **Scope**: this is materially bigger than course-catalog-mvp (auth, DB
  schema + migrations, protected routes, CRUD UI, rewiring both the public
  site and the sync job). Expect this to need chained PRs, not one batch —
  the last change already went over its review budget once.
- **Secrets**: needs `DATABASE_URL` (Neon) and Better Auth secrets in
  production — not required by anything shipped so far.
- **Single-admin scope**: no self-registration, no social login, no
  multi-user roles — deliberately minimal since this is one person's site.

### Ready for Proposal

Yes.
