# Design: Free-course aggregator MVP

## Technical Approach

Course records live as **git-committed JSON content files**, not a
database. YouTube's sync job and Udemy's manual curation both produce/edit
the same JSON shape; Next.js reads them at build time and renders every
catalog page via SSG, satisfying the `course-catalog` spec's SEO
requirement with zero request-time third-party or DB calls. Both ingestion
paths land through a **pull request**, giving the same editorial review
step to automated YouTube updates and manual Udemy entries.

## Architecture Decisions

### Decision: Content storage

**Choice**: JSON files under `content/courses/{platform}/{slug}.json`,
committed to git, validated against a Zod schema at build time.
**Alternatives considered**: Postgres/SQLite via an ORM; a headless CMS.
**Rationale**: catalog size is small at MVP (curated, not scraped at scale);
git gives free versioning/audit trail for the `last_verified_at` claims the
spec requires; zero infra to operate for a solo maintainer; content changes
naturally become reviewable diffs.

### Decision: YouTube sync execution

**Choice**: `scripts/sync-youtube.ts` (Node script) run by a scheduled
GitHub Action, using curated channel/playlist IDs from
`content/sources/youtube-channels.json`. The Action writes/updates JSON
files and opens a PR (not a direct commit).
**Alternatives considered**: a Next.js API route triggered by an external
cron (Vercel Cron); direct commit to `main`.
**Rationale**: no server needs to run continuously; PR-based updates give
one review point before "free" claims go live, consistent with the
`content-ingestion` spec's re-verification intent; matches the `auto-chain`
delivery preference already in use for this project's own SDD changes.

### Decision: Hosting

**Choice**: Vercel, custom domain `cursos.unaividal.com`.
**Alternatives considered**: self-hosted Node server.
**Rationale**: native Next.js SSG/ISR support, zero-config custom domains,
free tier fits current traffic expectations.

### Decision: Outbound click tracking

**Choice**: Google Analytics 4 (`gtag.js`), firing a custom `outbound_click`
event on the course-detail CTA.
**Alternatives considered**: Plausible; Vercel Analytics; building our own
click-logging endpoint + DB.
**Rationale**: free, no infra to run, satisfies the spec's "event is
recorded" requirement without a database. Trade-off accepted: unlike
Plausible/Vercel Analytics, GA4 uses non-essential cookies, so an EU
audience requires a consent banner before it fires — added as an explicit
task (gate `gtag.js` load behind consent, e.g. via `next/script` +
`vanilla-cookieconsent` or a minimal custom banner).

## Data Flow

    youtube-channels.json ──▶ sync-youtube.ts ──▶ PR ──▶ content/courses/youtube/*.json
                                                              │
    Editor (manual check) ───────────────────────────────────┼──▶ content/courses/udemy/*.json
                                                              ▼
                                              Zod validation (build time)
                                                              │
                                                              ▼
                                            Next.js SSG: home / [category] / [category]/[slug]
                                                              │
                                                              ▼
                                          Outbound click ──▶ analytics event ──▶ source platform

## File Changes

| File | Action | Description |
|------|--------|--------------|
| `src/lib/courses/schema.ts` | Create | Zod schema + TS type for a course record |
| `src/lib/courses/read.ts` | Create | Loads + validates all `content/courses/**/*.json` at build time |
| `content/courses/youtube/*.json` | Create | One file per YouTube course (sync-managed) |
| `content/courses/udemy/*.json` | Create | One file per Udemy course (manually curated) |
| `content/sources/youtube-channels.json` | Create | Curated channel/playlist IDs for the sync job |
| `content/categories.json` | Create | Fixed MVP category list |
| `scripts/sync-youtube.ts` | Create | YouTube ingestion job (spec: `content-ingestion`) |
| `.github/workflows/sync-youtube.yml` | Create | Scheduled trigger + PR creation for the sync job |
| `src/app/page.tsx` | Modify | Home: featured/latest courses |
| `src/app/[category]/page.tsx` | Create | Category listing page |
| `src/app/[category]/[slug]/page.tsx` | Create | Course detail page + outbound CTA |

## Interfaces / Contracts

```typescript
// src/lib/courses/schema.ts
type CourseRecord = {
  slug: string;
  title: string;
  platform: "youtube" | "udemy";
  category: string;
  sourceUrl: string;
  freeStatus: "free"; // only free records are ever committed
  lastVerifiedAt: string; // ISO date
  youtube?: { videoId: string; channelId: string }; // when platform === "youtube"
};
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|--------------|----------|
| Unit | Zod schema rejects records missing required fields | `content-catalog` spec scenario "Missing required field blocks publish" |
| Unit | `sync-youtube.ts` dedupes by `videoId` (no duplicate records) | Spec scenario "Sync re-run does not duplicate" |
| Integration | Build fails if any committed JSON fails validation | Run `npm run build` against a fixture with one bad record |
| E2E | Course detail page renders without JS and includes title/platform/category | Spec scenario "Course detail page is crawlable without JS" |

No test runner exists yet (`strict_tdd: false`); tasks phase should include
adding Vitest as a prerequisite for the unit-layer tests above.

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation *execution*, or
process-integration boundary in the app itself. (The GitHub Action opens a
PR via standard `git`/`gh` CLI in CI, not via app-controlled subprocess
invocation from user input — out of scope for the threat matrix.)

## Migration / Rollout

No migration required — greenfield project, no production traffic yet.
Rollout: merge → Vercel deploy → verify home/category/detail pages render →
point `cursos.unaividal.com` DNS at Vercel.

## Open Questions

None — analytics resolved to Google Analytics 4 (see decision above);
category list resolved in `content/categories.json` (tasks phase).
