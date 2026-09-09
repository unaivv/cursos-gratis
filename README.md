# cursos-unaividal

A catalog of **free** YouTube and Udemy courses, organized by category,
with manual verification and a last-checked date on every card. Live at
[cursos.unaividal.com](https://cursos.unaividal.com).

See the full change definitions (proposal, specs, design, tasks) in
`openspec/changes/course-catalog-mvp/` (initial catalog) and
`openspec/changes/admin-panel/` (database + admin panel).

## Development

```bash
npm run dev     # dev server
npm run build   # production build (catalog pages are dynamic — read Postgres on every request)
npm run start   # serve the production build
npm run lint    # ESLint
npm run test    # Vitest (unit + integration)
```

## Database

Supabase Postgres + Drizzle ORM (`src/lib/db/`). The catalog originally
lived as JSON in git; it moved to a database so it could be managed from
the admin panel without waiting on a deploy — see
`openspec/changes/admin-panel/design.md`.

Setup:

1. Copy `.env.local.example` to `.env.local`.
2. `DATABASE_URL` — Supabase connection string. The direct connection
   (port 5432) is fine for one-off scripts (migrations, seeding); the
   app's own runtime needs the **pooler** ("Transaction" mode, port 6543)
   — see design.md. Never paste it in chat or commit it.
3. `BETTER_AUTH_SECRET` — generate one with `openssl rand -base64 32`.
4. `npm run db:generate` — generates SQL migrations from
   `src/lib/db/schema.ts` + `src/lib/db/auth-schema.ts` (no real
   connection needed).
5. `npm run db:migrate` — applies the migrations (needs a real
   `DATABASE_URL`).
6. `npm run db:seed` — seeds categories (`scripts/seed-categories.ts`).
7. `ADMIN_EMAIL`/`ADMIN_PASSWORD` (pick your own, don't paste them in
   chat) + `npx tsx scripts/seed-admin.ts` — creates the single admin
   user. There's no public sign-up; this script is the only way to
   create an account.

## Content: how courses get added

Courses live in the `courses` table (Supabase), not in files. Every
course has a `status`: `pending` (awaiting review) or `published`
(visible on the public site). Full management from **`/admin`** (login:
`ADMIN_EMAIL`/`ADMIN_PASSWORD` seeded with `npx tsx scripts/seed-admin.ts`).

### YouTube (automated)

`scripts/sync-youtube.ts` syncs the curated channels/playlists in
`content/sources/youtube-channels.json` (never `search.list` — quota
limited to ~100 calls/day) and **inserts every new course as
`pending`** — it doesn't show up on the public site until published from
`/admin`. `scripts/discover-youtube.ts` complements it with a small set
of category-tagged searches (`content/sources/youtube-search-terms.json`)
so courses from channels that aren't curated yet can surface too — see
`scripts/README.md` for the full picture (quota tradeoffs, where each
one runs).

Runs:

- Locally: `YOUTUBE_API_KEY=... DATABASE_URL=... npm run sync:youtube`
- Weekly cron on the raspi that serves the site — see `scripts/README.md`.
- CI (manual only): `.github/workflows/sync-youtube.yml`
  (`workflow_dispatch`), needs the `YOUTUBE_API_KEY` and `DATABASE_URL`
  repo secrets.

To add a new channel, add an entry to
`content/sources/youtube-channels.json`. To widen the search-based
discovery, add an entry to `content/sources/youtube-search-terms.json`.

### Udemy (manual curation — no API)

Udemy's affiliate API was discontinued on 2025-01-01 (see
`openspec/changes/course-catalog-mvp/research.md`), so Udemy courses are
added by hand from `/admin`:

1. Manually confirm the course is free (no coupon, no expiry).
2. Create it in the panel — it can be published right away (the admin is
   the one reviewing it at creation time).
3. Re-verify every `content.udemy_reverify_days` days
   (`openspec/config.yaml` — 30 by default) that the course is still
   free, and update `lastVerifiedAt` from the panel.

## Analytics

Google Tag Manager, loaded only after consent (cookie banner) — see
`src/components/analytics/`. Set `NEXT_PUBLIC_GTM_ID` in the production
environment to enable it (GA4 or other tags are then configured inside
the GTM container itself, not in this code); without that variable, the
site works the same, just without analytics.

## Course suggestions

`/sugerir` — a public form that saves to the `course_suggestions` table
(Supabase) and, if `RESEND_API_KEY`/`RESEND_FROM_EMAIL` are set, notifies
`ADMIN_EMAIL` by email. A suggestion never publishes itself — same manual
review as the rest of the catalog.

## Popular searches

The "peticiones populares" chips on the home page are dynamic: every
`/buscar` search that finds at least one result gets logged to
`search_queries`; the home page shows the most frequent ones from the
last 30 days (`src/lib/courses/popular-searches.ts`). Falls back to a
fixed, reasonable list until there's enough real history.

## Deployment

Runs on the author's own Raspberry Pi, behind a Cloudflare tunnel
(`cursos.unaividal.com`), like the rest of their personal projects — PM2
+ a Next.js `standalone` build. See `deploy.sh`, `ecosystem.config.cjs`,
`start-prod.mjs`/`.sh`.

## Automated content discovery

A weekly cron on the same Raspberry Pi runs the YouTube channel sync and
the broader search-based discovery, saving anything new as `pending`
(manual review before publishing) — with an email digest of what it
found. See `scripts/README.md`.
