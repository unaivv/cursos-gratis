# Tasks: Admin panel with authenticated course management

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~1800–2400 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 → PR 2 → PR 3 → PR 4 (stacked) |
| Delivery strategy | auto-chain |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

Learned from `course-catalog-mvp` (forecast ~700, actual 1113 authored):
plan the split up front this time instead of discovering the overrun
after the fact.

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|------------------|--------------------|
| 1 | DB foundation: schema, Drizzle client, migrations, categories seed, existing-course migration | PR 1 | `npx vitest run src/lib/db` | Manual: run migration against the user's real Supabase project, verify row counts — **needs `DATABASE_URL` (pooler URL), see blocker below** | `src/lib/db/`, `drizzle/`, `drizzle.config.ts` |
| 2 | `admin-auth`: Better Auth config, login page, session gate, sign-up block, seed-admin script | PR 2 | `npx vitest run src/lib/auth` | Manual: log in with seeded admin, confirm wrong password rejected, confirm sign-up endpoint 404s | `src/lib/auth/`, `src/app/admin/layout.tsx`, `src/app/admin/login/`, `src/app/api/auth/` |
| 3 | Cutover: public reads move to DB (`published`-only, tagged), sync job writes DB rows, remove `content/courses/**` | PR 3 | `npx vitest run src/lib/courses` | Manual: `npm run build && npm run start`, confirm public pages render from DB | `src/lib/courses/read.ts`, `scripts/sync-youtube.ts` |
| 4 | `admin-panel`: CRUD UI (list/create/edit/delete/publish) + revalidation wiring | PR 4 | `npx vitest run src/app/admin` | Manual: create → publish → visible on public site without redeploy | `src/app/admin/page.tsx`, `courses/`, `actions.ts` |

**Blocker before Unit 1's runtime harness can run**: this needs a real
Supabase `DATABASE_URL` (the **pooler** connection string, port 6543) and
a `BETTER_AUTH_SECRET` — external accounts/secrets only the user can
provision. Code for all four units can be written and typechecked without
them; migrations and the manual runtime checks cannot.

## Phase 1: Foundation — Unit 1 (PR 1)

- [x] 1.1 `npm install drizzle-orm postgres`, `npm install -D drizzle-kit`
- [x] 1.2 Create `drizzle.config.ts` and `src/lib/db/schema.ts` (`courses`, `categories` — per design.md Interfaces)
- [x] 1.3 Create `src/lib/db/client.ts` (`postgres-js` driver, Supabase pooler URL, `prepare: false` + Drizzle client, reads `DATABASE_URL`)
- [x] 1.4 Generate + commit initial migration (`drizzle-kit generate`) — `drizzle/0000_low_purple_man.sql`, 2 tables, generated without a live connection (verified `drizzle-kit generate` doesn't require one)
- [x] 1.5 Write `scripts/seed-categories.ts` (from `content/categories.json`) — **run for real** against the user's Supabase DB: 7 categories seeded
- [x] 1.6 Write `scripts/migrate-courses.ts` (existing `content/courses/**` → DB rows, `status: published`) — **run for real**: 1 course migrated, verified via direct query readback

## Phase 2: `admin-auth` — Unit 2 (PR 2)

- [x] 2.1 `npm install better-auth` — needed `.npmrc` (`legacy-peer-deps=true`) to resolve a peerOptional vitest range conflict; see Deviations
- [x] 2.2 Create `src/lib/auth/config.ts` (Better Auth + Drizzle adapter, `emailAndPassword.enabled: true`)
- [x] 2.3 Generate Better Auth's Drizzle schema (`user`/`session`/`account`/`verification`) via `npx @better-auth/cli@latest generate`, added to migrations — **applied for real** against Supabase
- [x] 2.4 Create `src/app/api/auth/[...all]/route.ts` wrapping `toNextJsHandler`, blocking any `sign-up*` path (spec: Sign-up endpoint is blocked) — guard logic extracted to `src/lib/auth/guards.ts` for unit testing
- [x] 2.5 Create `src/app/admin/(protected)/layout.tsx` — session gate (moved into a route group, not directly `src/app/admin/layout.tsx`, so `/admin/login` doesn't gate itself into a redirect loop — see Deviations)
- [x] 2.6 Create `src/app/admin/login/page.tsx`
- [x] 2.7 Write `scripts/seed-admin.ts` — **run for real**, admin user created in Supabase

## Phase 3: Cutover — Unit 3 (PR 3)

- [x] 3.1 Rewrite `src/lib/courses/read.ts` — Drizzle queries via `unstable_cache` (tag `courses`/`categories`), `published`-only filter (spec: Published-only public listing) — verified live: pending row invisible on category page + 404 on direct URL
- [x] 3.2 Update `src/lib/courses/schema.ts` — add `status` field (spec: Course record shape)
- [x] 3.3 Update `scripts/sync-youtube.ts` — Drizzle upsert by `slug` with `status: pending` instead of JSON files (spec: YouTube sync writes pending records) — also fixed a re-sync bug found while implementing: a re-sync was overwriting an already-`published` course back to `pending`; `dedupeByVideoId` now preserves existing status, see apply-progress.md
- [x] 3.4 Rewrote `.github/workflows/sync-youtube.yml` — no PR step, runs the sync directly against `DATABASE_URL`
- [x] 3.5 Deleted `content/courses/**` — verified against real data first (build + live curl checks)

## Phase 4: `admin-panel` — Unit 4 (PR 4)

- [x] 4.1 Create `src/app/admin/(protected)/actions.ts` — Server Actions: create, update, delete, publish, unpublish — no `revalidateTag` (dropped, see design.md revised Revalidation decision); `router.refresh()` from the client callers instead
- [x] 4.2 Create `src/app/admin/(protected)/page.tsx` — list all courses, status visible (spec: List every course regardless of status)
- [x] 4.3 Create `.../courses/new/page.tsx` and `[id]/edit/page.tsx` — forms validated against `courseRecordSchema` via `useActionState` (spec: Create and edit validate the same shape)
- [x] 4.4 Add publish/unpublish controls to the list (spec: Publish/unpublish toggles visibility)
- [x] 4.5 Add delete with confirmation step (spec: Delete requires confirmation) — `window.confirm()`
- [x] 4.6 Flag stale Udemy records (`last_verified_at` past `udemy_reverify_days`) in the admin list (spec: Stale Udemy record flagged) — `src/lib/courses/staleness.ts`

## Phase 5: Testing

- [x] 5.1 Unit: course schema accepts/rejects `status` values correctly
- [x] 5.2 Unit: sign-up path guard rejects `/api/auth/sign-up/email` before reaching Better Auth
- [x] 5.3 Unit: publish/unpublish are pure status transitions (no other field changes) — `src/lib/courses/status-transition.ts`
- [x] 5.4 Manual runtime harness: full flow — **run for real via a throwaway Playwright script** (login → create pending → confirm invisible publicly → publish → confirm visible → edit → confirm updated → delete with confirm dialog → confirm gone everywhere), 11/11 checks passed against the real Supabase DB. This is also what caught the revalidation bug — see Deviations in apply-progress.md

## Phase 6: Cleanup

- [x] 6.1 Update `README.md` — DB setup, `.env.local` variables needed, `scripts/seed-admin.ts`
- [x] 6.2 Confirmed `.env.local` is gitignored (`.gitignore`'s `.env*` pattern); `.env.local.example` explicitly un-ignored so it IS committed as a safe template
