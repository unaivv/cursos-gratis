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

## AI review of new videos (`intake-youtube.ts`)

Both `sync-youtube.ts` and `discover-youtube.ts` route every **new** video
through `intake-youtube.ts` instead of dumping it in the admin queue:

1. Already rejected in a previous run (`rejected_videos` table)? Dropped.
2. Shorter than 10 minutes? Rejected without an API call.
3. Claude decides "is this a real course?" and, if so, writes the summary,
   overview, highlights and level (grounded only in the video's own data).
4. Approved → inserted as **pending with its summary**, ready to approve in
   `/admin` (never auto-published). Rejected → remembered, and listed with
   the reason in the digest email so a wrongly discarded one can be rescued.
5. Review errors / refusals / missing videos are **skipped and retried** next
   run — never treated as a rejection.

Needs `ANTHROPIC_API_KEY` in the environment (raspi cron `.env`, and the
GitHub secret). Model defaults to `claude-opus-5`, override with
`AI_REVIEW_MODEL`. Without the key the length prefilter still runs and the
rest are added as pending *without* a summary, with a warning in the log
and the digest email. After pulling this change on the raspi run `npm ci`
(the SDK is a new dev dependency; if it's missing only the AI review is
lost, the rest of the sync still runs).

To rescue a video the AI rejected: delete its row from `rejected_videos`
and it will be reviewed again next run, or add it by hand from `/admin`.

## `enrich-youtube.ts` — real per-course content

Fills `duration_seconds`, `lesson_count`, `chapters` (video chapters or
playlist lesson titles), `description` and `published_at` from the YouTube
Data API, so a course page shows facts specific to that course instead of
a template line. Costs ~1 quota unit per call (videos batched 50 at a
time). `sync-youtube.ts` calls it at the end of every run for rows not yet
enriched; run it by hand to backfill after a migration:

```bash
DATABASE_URL=... YOUTUBE_API_KEY=... npx tsx scripts/enrich-youtube.ts          # only rows not enriched yet
DATABASE_URL=... YOUTUBE_API_KEY=... npx tsx scripts/enrich-youtube.ts --force  # re-fetch everything
```

Udemy courses can't be enriched (scraping is blocked) — those pages rely
on the per-course "nota editorial" field in the admin panel.

## `export-course-data.ts` / `import-ai-content.ts` — AI summaries

Two-step flow for the AI-written summary shown on listing cards and the
"De qué trata" section of each course page. Generation happens outside the
repo (no API key needed here): export the grounded data, have Claude write
`{id, summary, overview, highlights, level}` per course from *only* that
data, then import.

```bash
DATABASE_URL=... npx tsx scripts/export-course-data.ts /tmp/in.json      # only rows without AI content yet
# ...generate /tmp/out.json (array of aiContentSchema objects)...
DATABASE_URL=... npx tsx scripts/import-ai-content.ts /tmp/out.json      # validates, skips + reports bad rows
```

Only enriched YouTube courses are exported: a summary written from a bare
title (Udemy) would be invented. New videos from the weekly sync have no AI
content until this flow is run again; their cards simply show no summary.

## `seed-categories.ts`, `seed-admin.ts`, `migrate-courses.ts`

One-off setup scripts — see the main README's "Base de datos" section.
