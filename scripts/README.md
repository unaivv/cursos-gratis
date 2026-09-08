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
```

## `seed-categories.ts`, `seed-admin.ts`, `migrate-courses.ts`

One-off setup scripts — see the main README's "Base de datos" section.
