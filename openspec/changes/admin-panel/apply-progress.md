# Apply Progress: Admin panel with authenticated course management

**Mode**: Standard (strict_tdd: false)
**Status**: All 4 units complete and verified against the real Supabase
database, end to end. The full admin flow (login → create → publish →
edit → delete) was proven live via a throwaway Playwright script, which
also caught a real revalidation bug — fixed, see Unit 4 below. The
public site is now plain dynamic server rendering (not cached, not
pre-rendered) reading Postgres per request — see the revised
Revalidation decision in design.md for why.

## Completed Tasks

All phases (Units 1–4): all `[x]` — see `tasks.md` for per-task notes.

## Files Changed

| File | Action | What was done |
|------|--------|----------------|
| `package.json` | Modified | Added `drizzle-orm`, `postgres` deps, `drizzle-kit` dev dep; `db:generate`/`db:migrate`/`db:seed` scripts |
| `drizzle.config.ts` | Created | Drizzle Kit config, `dialect: "postgresql"`, reads `DATABASE_URL` |
| `src/lib/db/schema.ts` | Created | `courses` + `categories` tables (matches design.md Interfaces) |
| `src/lib/db/client.ts` | Created | `postgres-js` driver, Supabase pooler connection, `prepare: false` |
| `drizzle/0000_low_purple_man.sql` | Created | Initial migration — verified `drizzle-kit generate` needs no live connection |
| `scripts/seed-categories.ts` | Created | Idempotent upsert from `content/categories.json` |
| `scripts/migrate-courses.ts` | Created | Idempotent upsert of existing course JSON → DB rows, `status: published` |
| `.env.local.example` | Created | Template with the real project ref filled in, password/region as placeholders |
| `README.md` | Modified | Database setup section (part of task 6.1, pulled forward since directly relevant now) |
| `.npmrc` | Created | `legacy-peer-deps=true` — see Deviations |
| `src/lib/db/auth-schema.ts` | Created | Better Auth's Drizzle schema (`user`/`session`/`account`/`verification`), generated via `@better-auth/cli` |
| `drizzle/0001_windy_king_bedlam.sql` | Created | Migration for the four Better Auth tables — applied for real |
| `src/lib/auth/config.ts` | Created | Better Auth server config, Drizzle adapter |
| `src/lib/auth/guards.ts` + `.test.ts` | Created | `isSignUpPath` — extracted for unit testing (5 tests) |
| `src/lib/auth/client.ts` | Created | `better-auth/react` client (`authClient`) for login/logout/session in Client Components |
| `src/app/api/auth/[...all]/route.ts` | Created | Better Auth handler, sign-up path blocked before delegation |
| `src/app/admin/(protected)/layout.tsx` | Created | Session gate — see Deviations for the route-group fix |
| `src/app/admin/(protected)/page.tsx` | Created | Placeholder authenticated page (Unit 4 replaces with real course list); needed to runtime-test the full auth flow now |
| `src/app/admin/(protected)/logout-button.tsx` | Created | Client component, calls `authClient.signOut` |
| `src/app/admin/login/page.tsx` | Created | Login form, calls `authClient.signIn.email` |
| `src/lib/courses/read.ts` | Rewritten | Drizzle queries via `unstable_cache` (tags: `courses`/`categories`), `published`-only filter; maps DB rows → the existing `CourseRecord` shape so no UI component needed to change |
| `src/lib/courses/schema.ts` | Modified | Added `status: "pending" \| "published"` (defaults `"pending"`) |
| `src/lib/courses/read.test.ts` | Rewritten | Old filesystem-fixture tests removed (no longer applicable); now tests the pure `toCourseRecord` DB-row mapper |
| `src/app/page.tsx`, `[category]/page.tsx`, `[category]/[slug]/page.tsx` | Modified | Awaits the now-async `read.ts` functions (Drizzle queries are async; filesystem reads weren't) |
| `scripts/sync-youtube.ts` | Rewritten | Reads existing rows from Postgres instead of JSON files; upserts by `slug` instead of writing files; `dedupeByVideoId` now preserves an existing record's `status` across re-syncs (bug found and fixed during this unit — see Issues Found) |
| `scripts/sync-youtube.test.ts` | Modified | Added a status-preservation regression test |
| `.github/workflows/sync-youtube.yml` | Rewritten | No PR step (nothing to open a PR against); runs the sync directly with `DATABASE_URL` + `YOUTUBE_API_KEY` secrets |
| `vitest.config.mts` | Modified | Added the `@/*` path alias (Vitest doesn't read tsconfig paths) and a placeholder `DATABASE_URL` test env var (client construction is lazy — no real DB touched by unit tests) |
| `content/courses/` | Deleted | Superseded by the `courses` table — deleted only after 3.1–3.3 were verified against real data |
| `README.md` | Modified | Rewrote the content-management section for the DB-backed workflow |
| `src/lib/config.ts` | Created | `UDEMY_REVERIFY_DAYS` constant (mirrors `openspec/config.yaml`) |
| `src/lib/db/admin-queries.ts` | Created | Unfiltered, uncached admin reads (`listAllCourses`, `getCourseById`) |
| `src/lib/courses/staleness.ts` + `.test.ts` | Created | `isStaleUdemy` — pure, 3 tests |
| `src/lib/courses/status-transition.ts` + `.test.ts` | Created | `nextCourseStatus` — pure, 2 tests |
| `src/app/admin/(protected)/actions.ts` | Created | Server Actions: create/update/delete/setStatus |
| `src/app/admin/(protected)/courses/form-schema.ts` | Created | Builds + validates a course record from `FormData` against `courseRecordSchema` |
| `src/app/admin/(protected)/courses/CourseForm.tsx` | Created | Shared create/edit form (`useActionState`), slug auto-fill from title until manually edited |
| `src/app/admin/(protected)/courses/new/page.tsx`, `[id]/edit/page.tsx` | Created | Create/edit routes |
| `src/app/admin/(protected)/courses/PublishToggleButton.tsx`, `DeleteCourseButton.tsx` | Created | Client components, call the action then `router.refresh()` |
| `src/app/admin/(protected)/page.tsx` | Rewritten | Real course list (all statuses, stale-Udemy flag) — replaces the Unit 2 placeholder |
| `src/lib/courses/read.ts` | Rewritten (again) | Dropped `unstable_cache` entirely — see Deviations |
| `src/app/page.tsx`, `[category]/page.tsx`, `[category]/[slug]/page.tsx` | Modified | Dropped `generateStaticParams`; added `export const dynamic = "force-dynamic"` |

## Deviations from Design

1. `npm install better-auth` failed on a real `ERESOLVE` conflict:
   better-auth's `peerOptional vitest` range (`^2‖^3‖^4`) vs our real
   `vitest ^5`. Not documented in design.md because it only surfaces at
   install time. Fixed with a committed `.npmrc`
   (`legacy-peer-deps=true`) — verified this also fixes a from-scratch
   `npm ci` (what CI/Vercel actually run), not just the local install.
2. That same legacy-peer-deps resolution silently pruned `vite` from
   `node_modules` (a transitive dep vitest needs) on the first install
   attempt, breaking `npm run test` with `ERR_MODULE_NOT_FOUND`. Fixed by
   adding `vite` as an explicit devDependency so it can't be pruned again.
3. **Route-group fix, not in design.md**: gating `src/app/admin/layout.tsx`
   directly would gate `/admin/login` too (it's under `/admin/**`),
   causing an infinite redirect loop — the unauthenticated login page
   would redirect to itself. Fixed by moving the gate into
   `src/app/admin/(protected)/layout.tsx`, a route group that doesn't
   affect the URL but excludes `/admin/login` from the gate. Caught before
   it shipped, not discovered via the runtime harness.
4. `@better-auth/cli`'s `generate` command doesn't take `--adapter`/
   `--dialect` flags as some third-party guides claimed — it infers both
   from the config file. Used `--config` and `--output` only.
5. **Major, found via the Unit 4 end-to-end test, not by inspection**:
   the original `unstable_cache` + `revalidateTag('courses', 'max')`
   design from Units 1–3 did not make admin edits visible on the public
   site. Root causes (both real, both now documented in design.md's
   revised Revalidation decision): (a) `profile="max"` is explicitly
   stale-while-revalidate — the very next request is still served the OLD
   cached value; (b) Next.js 16's `updateTag`/`revalidateTag` docs only
   document `fetch`'s `next.tags` and `cacheTag()` as tag sources,
   `unstable_cache`'s `tags` option is never confirmed compatible with
   either. Fixed by removing `unstable_cache` and `generateStaticParams`
   entirely — public pages are now plain `force-dynamic` server renders,
   correct by construction, no cache-invalidation surface at all. Also
   removed `revalidateTag` calls from the write actions; the two actions
   invoked outside a `redirect()` flow now have their client callers call
   `router.refresh()` instead, to refresh the admin's own list view.

## Issues Found

1. **Security incident, self-caused and self-corrected**: while debugging
   why an `.env.local` edit hadn't taken effect, a `sed` command meant to
   redact the DB password from my own diagnostic output used a
   quote-anchored pattern that didn't match the actual (unquoted) line
   format, so the real Supabase DB password briefly appeared in my tool
   output (not shown to the user in chat, but present in this session's
   transcript/logs). Root cause of the original bug: an earlier `>>`
   append to `.env.local` landed on the same line as the existing
   `DATABASE_URL` value (no trailing newline in the file at the time),
   corrupting the connection string with a glued-on
   `BETTER_AUTH_SECRET=...` suffix — that's what `seed-admin.ts` first
   failed against (`database "postgresBETTER_AUTH_SECRET=..." does not
   exist`). Fixed by stripping the corrupted suffix with a targeted `sed`.
   **Recommend the user rotate the Supabase DB password** as a precaution
   since it was exposed to me, even though it never reached the visible
   chat.
2. `npm audit` reports 4 moderate vulnerabilities in `drizzle-kit`'s
   transitive `esbuild` dependency (dev-server-only, dev-time CLI tool,
   not shipped to production) — not fixed, since the fix (`npm audit fix
   --force`) downgrades `drizzle-kit` to 0.18.1, a breaking change, for a
   risk that doesn't reach the deployed app.
3. **Re-sync status bug, found and fixed before shipping**: the original
   `dedupeByVideoId` port (same merge logic as the JSON-file version)
   would have overwritten an already-`published` course's status back to
   `pending` on every re-sync, silently un-publishing it. Not caught by
   the existing dedupe test (it only checked record count/field refresh,
   never status). Fixed by preserving the existing record's `status` on
   merge; added a regression test
   (`sync-youtube.test.ts` — "preserves a published record's status").

## Work Unit Evidence

### Unit 1 (DB foundation)

| Evidence | Result |
|---|---|
| Focused test command | `npx tsc --noEmit` → 0 errors; `npm run test` → 13/13 |
| Runtime harness | **Real**: `npm run db:migrate` + `npm run db:seed` against Supabase, verified via direct `postgres-js` readback (7 categories, 1 published course) |
| Rollback boundary | `src/lib/db/`, `drizzle/0000_*.sql`, `drizzle.config.ts`, the two scripts — additive, inert until Unit 3 wires them in |

### Unit 2 (`admin-auth`)

| Evidence | Result |
|---|---|
| Focused test command | `npm run test` → 18/18 (13 + 5 new `isSignUpPath` tests); `npx tsc --noEmit` → 0 errors; `npm run lint` → 0 errors; `npm run build` → `/admin` and `/api/auth/[...all]` correctly dynamic (ƒ) |
| Runtime harness | **Real, full flow against `npm run start` + the real Supabase DB**: (1) `POST /api/auth/sign-up/email` → `404` (blocked); (2) `GET /admin` unauthenticated → `307` to `/admin/login`; (3) sign-in with wrong password → `401`; (4) sign-in with the seeded admin's real credentials → `200`, then `GET /admin` with that session → `200`, page shows the logged-in email; (5) `POST /api/auth/sign-out` → `200 {"success":true}`, then `GET /admin` → `307` to `/admin/login` again. Every scenario in the `admin-auth` spec verified live, not just typechecked |
| Rollback boundary | `src/lib/auth/`, `src/app/admin/`, `src/app/api/auth/`, `drizzle/0001_*.sql` — additive; dropping the four Better Auth tables would need a follow-up migration but nothing else in the app references them yet |

### Unit 3 (cutover)

| Evidence | Result |
|---|---|
| Focused test command | `npm run test` → 19/19; `npx tsc --noEmit` → 0 errors; `npm run lint` → 0 errors |
| Runtime harness | **Real, against the live Supabase DB**: `npm run build` generates all category/course pages from Postgres. `npm run start` + curl: home/category/detail all serve the real migrated course. Inserted a `pending` test row directly via SQL, restarted the server (fresh cache) — category page shows `0` matches for it, direct detail URL → `404`; deleted the test row after |
| Rollback boundary | `src/lib/courses/read.ts` fully replaces its filesystem implementation (git history has the old version); `content/courses/` deletion is reversible from git history if ever needed |

### Unit 4 (`admin-panel` CRUD UI)

| Evidence | Result |
|---|---|
| Focused test command | `npm run test` → 27/27 (19 + 8 new: `staleness` × 3, `status-transition` × 2, plus 3 more schema-status tests); `npx tsc --noEmit` → 0 errors; `npm run lint` → 0 errors; `npm run build` → `/`, `/[category]`, `/[category]/[slug]` all correctly `ƒ` (dynamic) |
| Runtime harness | **Real, full CRUD flow via a throwaway Playwright script against `npm run start` + the real Supabase DB, two browser contexts (admin session + anonymous public visitor)**: login → create a `pending` course → confirmed invisible on public category page and 404 on its direct detail URL → publish via the toggle → confirmed visible on the public category page AND its detail page returns 200 → edit the title → confirmed the new title in the admin list → delete with the confirm dialog accepted → confirmed gone from both the admin list and the public site. **11/11 checks passed.** This run is what found and proved the revalidation bug (Deviations #5) — the first attempt failed 5 of 11 checks, all traced to that one root cause |
| Rollback boundary | `src/app/admin/(protected)/courses/`, `actions.ts`, `page.tsx` (list) — additive/replaces only the Unit 2 placeholder; the `read.ts`/dynamic-rendering fix is the one change that also touches the already-shipped Units 1–3 code, documented above |

## Workload / PR Boundary

- Mode: chained PR slice (`stacked-to-main`)
- **All 4 units settled `passed`/`complete`** in the native SDD attempt ledger. `admin-panel` change is functionally done, pending only `sdd-verify`/`sdd-archive` and the user's decision on committing/deploying (nothing has been committed or pushed this session).
