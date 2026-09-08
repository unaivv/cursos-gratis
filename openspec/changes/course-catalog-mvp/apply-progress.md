# Apply Progress: Free-course aggregator MVP

**Mode**: Standard (strict_tdd: false)
**Status**: 21/21 tasks complete. Code verified (lint/test/build/manual
runtime check all pass). Native SDD attempt ledger settlement is blocked on
a changed-line budget decision (see below) — implementation itself is done.

## Completed Tasks

All tasks in `tasks.md` Phase 1–5 are marked `[x]`.

## Files Changed

| File | Action | What was done |
|------|--------|----------------|
| `package.json` | Modified | `@types/node` ^20→^22 (peer-dep fix for vitest), added `zod`, `vitest`, `tsx`; `test`/`sync:youtube` scripts |
| `vitest.config.mts` | Created | Node-environment test config |
| `src/lib/courses/schema.ts` | Created | Zod `CourseRecord`/`Category` schemas |
| `src/lib/courses/schema.test.ts` | Created | 7 unit tests (spec: course-catalog) |
| `src/lib/courses/read.ts` | Created | Load + validate `content/courses/**/*.json` |
| `src/lib/courses/read.test.ts` | Created | 2 tests incl. build-failure proxy (spec: course-catalog) |
| `content/categories.json` | Created | 7 MVP categories |
| `content/sources/youtube-channels.json` | Created | 2 real, verified curated channels (freeCodeCamp, CS50) |
| `content/courses/youtube/learn-python-full-course.json` | Created | Real, verified fixture course |
| `content/courses/udemy/example-placeholder-replace-me.json` | Created | Explicit placeholder — needs real editorial replacement |
| `scripts/sync-youtube.ts` | Created | YouTube ingestion job (spec: content-ingestion) |
| `scripts/sync-youtube.test.ts` | Created | 4 unit tests incl. dedupe (spec: content-ingestion) |
| `.github/workflows/sync-youtube.yml` | Created | Scheduled sync → PR |
| `src/app/page.tsx` | Modified | Real home page (categories + latest courses), boilerplate removed |
| `src/app/[category]/page.tsx` | Created | SSG category listing |
| `src/app/[category]/[slug]/page.tsx` | Created | SSG course detail + outbound CTA |
| `src/app/layout.tsx` | Modified | Real metadata, mounts `ConsentGate` |
| `src/components/analytics/gtag.ts` | Created | GA4 helper + `useSyncExternalStore`-based consent store |
| `src/components/analytics/ConsentGate.tsx` | Created | Cookie-consent banner gating GA4 |
| `src/components/courses/CourseCard.tsx` | Created | Shared card |
| `src/components/courses/OutboundCourseLink.tsx` | Created | CTA + `outbound_click` event |
| `README.md` | Modified | Dev commands, Udemy curation workflow, analytics config |

## Deviations from Design

1. Skipped `@testing-library/react`/jsdom — none of the actual test
   scenarios (schema validation, dedupe logic, build-failure proxy) need
   DOM rendering; adding it would be unused weight.
2. Task 4.3 ("`npm run build` fails on a fixture with one invalid course
   record") implemented as a Vitest test against `readAllCourses()` — the
   exact function every page calls at build time — rather than shelling
   out to a real `next build` per test run (slow, ~1–2 min). Ran the real
   `next build` separately as evidence (see Work Unit Evidence).
3. Task 4.4 (E2E/static HTML check) run once as a manual runtime-harness
   check (`npm run build && npm run start` + `curl`), not added as a
   permanent automated test — no headless-browser/server-lifecycle test
   tooling is set up yet for this project.
4. Found and fixed a real `react-hooks/set-state-in-effect` ESLint error in
   `ConsentGate` (reading localStorage via `useEffect` + `setState`) by
   switching to `useSyncExternalStore`, the React-recommended pattern for
   this exact case. Not in the original design; necessary for a clean lint.
5. UI copy (headings, CTA text, consent banner) written in Spanish, not
   English — the product itself (`cursos.unaividal.com`, "cursos gratis")
   is explicitly Spanish-market; treated as end-user product content, not
   an SDD engineering artifact. Flagged to the user; not independently
   confirmed.

## Issues Found

None beyond the ESLint finding above (fixed) and the budget note below.

## Work Unit Evidence

| Evidence | Result |
|---|---|
| Focused test command | `npm run test` → 13/13 passed (3 files) |
| Runtime harness | `npm run build && npm run start -- -p 4173`, then `curl http://localhost:4173/programming/learn-python-full-course` (no JS execution) → response HTML contains course title, "YouTube", and "programming" — confirms spec course-catalog scenario "Course detail page is crawlable without JS" |
| Additional | `npm run lint` → 0 errors, 0 warnings; `npm run build` → all routes prerendered (○ static / ● SSG), TypeScript passes |
| Rollback boundary | Entire change is additive/new (greenfield project, no prior commits, nothing pushed) — revert by discarding the working tree; no external side effects to undo |

## Workload / PR Boundary

- **Delivery strategy**: `auto-chain` (from session preflight)
- **Actual changed lines**: source-only estimate was 1,113 lines (22
  non-generated, non-planning files); the native ledger's full accounting
  — including `openspec/` planning docs and the regenerated
  `package-lock.json` — is **6,372 lines**, both over the 800-line budget.
  The `tasks.md` forecast (~650–750, source-only) underestimated this.
- **Resolution**: user explicitly chose `size:exception` (solo project,
  splitting into 4 PRs judged not worth the overhead vs. one MVP delivery).
  Recorded via `gentle-ai sdd-attempt reset` — see `last_reset` in
  `gentle-ai sdd-attempt status --change course-catalog-mvp` for the
  reason/actor/revision. Ledger `decision_required` is now `false`.
- **Nothing has been committed or pushed** — the user did not request that
  yet; the reset is a bookkeeping record, not a commit/PR.
