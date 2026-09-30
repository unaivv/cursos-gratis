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
   overview, highlights, level **and the editorial analysis** shown on the
   course page (audience, prerequisites, outcomes, structure, strengths and
   caveats, study plan, tips, before/after courses from our own catalog,
   verdict with a 1-5 score, FAQ) — grounded only in the video's own data.
4. Approved → inserted as **pending with its summary**, ready to approve in
   `/admin` (never auto-published). Rejected → remembered, and listed with
   the reason in the digest email so a wrongly discarded one can be rescued.
5. Review errors / refusals / missing videos are **skipped and retried** next
   run — never treated as a rejection.

Two backends, picked from the environment (`AI_REVIEW_BACKEND` forces one):

- **`cli` (no API credit):** Claude Code in headless mode, billed to a Claude
  subscription. Needs the CLI installed on the host
  (`npm i -g @anthropic-ai/claude-code`) and `CLAUDE_CODE_OAUTH_TOKEN` from
  `claude setup-token` in the cron `.env`. Runs with every tool disabled, no
  MCP, nothing persisted (never `--bare`: that mode ignores the subscription
  login). If cron's PATH doesn't find `claude`, set `CLAUDE_BIN` to its full
  path. Model alias defaults to `sonnet`.
- **`api`:** the Anthropic API with `ANTHROPIC_API_KEY` (needs API credit),
  model `claude-opus-5` by default.

`AI_REVIEW_MODEL` overrides the model for either. With no credentials the
length prefilter still runs and the rest are added as pending *without* a
summary, with a warning in the log and the digest email. After pulling on
the raspi run `npm ci` (`run-sync.sh` already does; if the SDK/CLI is
missing only the AI review is lost, the rest of the sync still runs).

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

## `ai-backfill.ts` — editorial analysis for the existing catalog

The course page only becomes **indexable** (no `noindex`, listed in the
sitemap) once it has the editorial analysis (`ai_analysis` column) or a
hand-written editor note of 300+ characters — see
`src/lib/courses/depth.ts`. New videos get the analysis at intake; this
script runs the same review over courses that are already published.

```bash
# on the raspi cron clone (has CLAUDE_CODE_OAUTH_TOKEN + DATABASE_URL in its .env):
npm run ai:backfill -- --limit 5 --dry-run   # review 5, print JSON, write nothing — spot-check quality first
npm run ai:backfill -- --limit 40            # a batch; re-run until "0 course(s) to analyze"
npm run ai:backfill                          # or everything pending in one go
```

Options: `--force` (re-analyze even current ones), `--limit N`,
`--category SLUG`, `--slug SLUG` (repeatable), `--include-pending`,
`--dry-run`, `--delay-ms N` (default 1500).

- **Idempotent and resumable:** skips courses whose analysis is already at
  `ANALYSIS_VERSION` (`src/lib/courses/ai-analysis.ts`; bump it to
  regenerate everything after a prompt change). Each result is written as
  soon as it arrives, so an interrupted run just continues next time. Stops
  after 3 consecutive failures (rate limit, expired token) — re-run later.
- **Grounded:** courses with no chapters and no meaningful description
  (Udemy, un-enriched rows) are listed and skipped, never analyzed from a
  bare title. Give them an editor note in `/admin`, or run
  `enrich-youtube.ts` first for YouTube rows.
- **Never unpublishes:** a course the review flags as "not a course" is
  only reported; decide in `/admin`.
- Same backends as the intake (`cli` via `CLAUDE_CODE_OAUTH_TOKEN`, or
  `api`). Locally, with a logged-in Claude Code CLI and no token:
  `AI_REVIEW_BACKEND=cli DATABASE_URL=... npm run ai:backfill`.
- Rewrites `ai_summary`/`ai_overview`/`ai_highlights`/`ai_level` too, so
  listing text and analysis stay consistent. `/admin` shows
  "análisis N/5" or "sin análisis" per course for spot checks.

## `export-course-data.ts` / `import-ai-content.ts` — manual alternative

Two-step flow for generating the same content outside the repo (prefer
`ai-backfill.ts`, which does this automatically). The export writes
`{id, slug, message}` per course, where `message` is exactly the prompt
input the automated review sees; have Claude answer each with
`REVIEW_SYSTEM_PROMPT` (`scripts/ai-review.ts`), convert to
`{id, summary, overview, highlights, level, analysis}` (analysis per
`courseAnalysisSchema`, with `version`), then import.

```bash
DATABASE_URL=... npx tsx scripts/export-course-data.ts /tmp/in.json      # only rows without the analysis yet
# ...generate /tmp/out.json...
DATABASE_URL=... npx tsx scripts/import-ai-content.ts /tmp/out.json      # validates, skips + reports bad rows
```

Only enriched YouTube courses are exported: an analysis written from a
bare title (Udemy) would be invented. `analysis` is optional in the import
(older summary-only files still work, leaving any analysis untouched).

## `seed-categories.ts`, `seed-admin.ts`, `migrate-courses.ts`

One-off setup scripts — see the main README's "Base de datos" section.
