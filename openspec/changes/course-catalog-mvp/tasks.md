# Tasks: Free-course aggregator MVP

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~650–750 |
| 400-line budget risk | Medium (within the project's 800-line budget) |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | auto-chain |
| Chain strategy | pending (not needed — under budget) |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|------------------|--------------------|
| 1 | Data layer: schema + fixtures | PR 1 (of 1) | `npx vitest run src/lib/courses` | N/A — pure data/validation, no live service | `src/lib/courses/`, `content/` |
| 2 | YouTube ingestion job | PR 1 (of 1) | `npx vitest run scripts/sync-youtube.test.ts` | Dry-run against 1 real curated channel ID | `scripts/sync-youtube.ts`, `.github/workflows/sync-youtube.yml` |
| 3 | Catalog pages + click tracking | PR 1 (of 1) | `npm run build` (SSG succeeds) | Manual: visit `/`, `/[category]`, `/[category]/[slug]` locally | `src/app/` |
| 4 | Test infra | PR 1 (of 1) | `npx vitest run` | N/A — tooling only | `vitest.config.ts`, `package.json` deps |

## Phase 1: Foundation

- [x] 1.1 Add Vitest to `package.json`, create `vitest.config.ts` (deviation: skipped `@testing-library/react`/jsdom — no component-rendering tests are needed for this batch, see Deviations)
- [x] 1.2 Create `src/lib/courses/schema.ts` — Zod `CourseRecord` schema per design's Interfaces section
- [x] 1.3 Create `content/categories.json` with the MVP category list
- [x] 1.4 Create `content/sources/youtube-channels.json` with 2–3 real curated channel/playlist IDs
- [x] 1.5 Add one fixture course per platform under `content/courses/{youtube,udemy}/`

## Phase 2: Core Implementation

- [x] 2.1 Create `src/lib/courses/read.ts` — load + validate all `content/courses/**/*.json` at build time, reject invalid records (spec: Missing required field blocks publish)
- [x] 2.2 Create `scripts/sync-youtube.ts` — pull `playlistItems.list`/`videos.list` for curated sources only, no `search.list` (spec: Sync uses curated sources)
- [x] 2.3 In `sync-youtube.ts`, dedupe by `videoId` before writing (spec: Ingestion pipeline is idempotent)
- [x] 2.4 In `sync-youtube.ts`, stop and log on quota exhaustion instead of throwing (spec: Quota exhaustion handled gracefully)
- [x] 2.5 Create `.github/workflows/sync-youtube.yml` — scheduled run, opens a PR with changed JSON files

## Phase 3: Integration / Wiring

- [x] 3.1 Modify `src/app/page.tsx` — render latest/featured courses from `read.ts`
- [x] 3.2 Create `src/app/[category]/page.tsx` — SSG category listing
- [x] 3.3 Create `src/app/[category]/[slug]/page.tsx` — course detail, `last_verified_at` visible (spec: Staleness surfacing)
- [x] 3.4 Add outbound CTA link + client-side `outbound_click` GA4 event (spec: Outbound click to source platform)
- [x] 3.5 Wire GA4 (`gtag.js` via `next/script`) gated behind a minimal cookie-consent banner (EU compliance)

## Phase 4: Testing

- [x] 4.1 Unit: `schema.ts` rejects a record missing `title`/`sourceUrl`/`lastVerifiedAt`
- [x] 4.2 Unit: `sync-youtube.ts` does not duplicate an already-ingested `videoId`
- [x] 4.3 Integration: `readAllCourses()` (called by every page at build time) throws on a fixture with one invalid course record — proxy for "`npm run build` fails", see Deviations
- [x] 4.4 E2E/static: fetch a course-detail page without executing JS, assert title/platform/category present in HTML — run once as a manual runtime-harness check (`npm run build && npm run start` + `curl`), see Work Unit Evidence; not added as a permanent automated test (no headless-browser/server-lifecycle tooling set up yet)

## Phase 5: Cleanup

- [x] 5.1 Document the Udemy manual-curation workflow (how to add a course, `udemy_reverify_days` cadence) in `README.md`
- [x] 5.2 Remove `create-next-app` boilerplate content no longer used (default hero/logo in `src/app/page.tsx`)
