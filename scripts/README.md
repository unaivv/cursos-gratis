# Scripts

## `sync-youtube.ts` — automated content discovery

Pulls new videos from the curated channels in
`content/sources/youtube-channels.json`, inserts them as `status: "pending"`
(never auto-published — a human still reviews every course from `/admin`,
same trust model documented in `/como-verificamos`), and emails a digest
of what's new to `ADMIN_EMAIL` (via Resend, if configured).

Udemy isn't part of this job: their affiliate API was discontinued
2025-01-01 (`openspec/changes/course-catalog-mvp/research.md`) and their
site actively blocks automated fetches (403), so Udemy courses stay a
manual `/admin` addition — see the main README's "Udemy" section.

## `discover-youtube.ts` — beyond the curated channel list

`sync-youtube.ts` only ever looks at channels we've already added by
hand — a genuinely good course from a channel nobody's curated yet stays
invisible forever. This runs a small, fixed set of category-tagged
searches (`content/sources/youtube-search-terms.json`) instead, so
courses from channels like MoureDev or Gentleman Programming (added as
curated channels too, but this is how anything *not* on that list gets a
chance) can surface.

Kept deliberately separate from the channel sync: `search.list` costs
100 quota units/call vs. ~1 for `channels.list`/`playlistItems.list`, so
it's a short fixed term list (~12 today, one call each) rather than
something that scales with the catalog. The only quality filter is
`videoDuration: long` (>20 min) — search results are noisier than a
curated channel by nature, so review these more carefully than
channel-sync ones. Same rule as everything else: lands as `pending`,
never auto-published.

To widen coverage, add more `{ "query", "category" }` entries to
`content/sources/youtube-search-terms.json` — no code change needed.

### Where it runs

**Raspi cron** (primary) — a standalone clone at
`~/cron-jobs/cursos-unaividal` on the same host that serves the site,
`git pull`ed and re-installed before every run so it always uses the
latest `main`. Crontab entry:

```
0 7 * * 1 /home/unai/cron-jobs/cursos-unaividal/run-sync.sh >> /home/unai/cron-jobs/cursos-unaividal/sync.log 2>&1
```

Env vars come from `~/cron-jobs/cursos-unaividal/.env` (gitignored,
not the deployed app's `.env.local`): `DATABASE_URL`, `YOUTUBE_API_KEY`,
`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_EMAIL`.

**GitHub Actions** (`.github/workflows/sync-youtube.yml`) — manual
dispatch only (`workflow_dispatch`), not scheduled, so it never runs
alongside the raspi cron and double-spends the daily YouTube quota or
sends a duplicate email. Useful for a one-off run without SSHing in;
needs `YOUTUBE_API_KEY` and `DATABASE_URL` as repo secrets (no email —
`RESEND_*`/`ADMIN_EMAIL` aren't set there on purpose, to keep the raspi
cron as the only place that actually notifies).

### Running by hand

```bash
DATABASE_URL=... YOUTUBE_API_KEY=... [RESEND_API_KEY=... RESEND_FROM_EMAIL=... ADMIN_EMAIL=...] \
  npx tsx scripts/sync-youtube.ts
DATABASE_URL=... YOUTUBE_API_KEY=... [RESEND_API_KEY=... RESEND_FROM_EMAIL=... ADMIN_EMAIL=...] \
  npx tsx scripts/discover-youtube.ts
```

The raspi cron (`run-sync.sh`) runs both, channel sync first.

## `seed-categories.ts`, `seed-admin.ts`, `migrate-courses.ts`

One-off setup scripts — see the main README's "Base de datos" section.
