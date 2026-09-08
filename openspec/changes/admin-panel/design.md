# Design: Admin panel with authenticated course management

## Technical Approach

Supabase Postgres + Drizzle ORM replace `content/courses/**/*.json` as the
course store. Better Auth (Drizzle adapter, same DB) protects
`src/app/admin/**`. Public pages switch from build-time SSG to plain
dynamic (uncached) server rendering — see the revised Revalidation
decision below — implements `course-catalog`'s "instant edit" and
`admin-panel`'s requirements.

## Architecture Decisions

### Decision: Route protection layer

**Choice**: authoritative session check in `src/app/admin/layout.tsx`
(calls `auth.api.getSession({ headers })`, redirects to `/admin/login` if
absent) — every admin page/action goes through this layout.
**Alternatives considered**: `proxy.ts` (Next 16's renamed middleware)
doing the check.
**Rationale**: `proxy` only sees the request, not React context, and a
cookie-presence check there is not the same as an actual verified
session; a layout-level check calls Better Auth's real session API. Kept
`proxy.ts` out entirely rather than run a weaker duplicate check.

### Decision: Blocking sign-up

**Choice**: wrap the catch-all handler — before delegating to
`toNextJsHandler(auth)`, reject any request whose path matches
`/api/auth/sign-up*` with 404.
**Alternatives considered**: trusting an undocumented Better Auth config
flag.
**Rationale**: research (`research.md` Q3) found no documented "disable
sign-up" option; guarding the route ourselves is verifiable and doesn't
depend on library internals. The one admin user is created by
`scripts/seed-admin.ts`, calling `auth.api.signUpEmail` server-side once,
never through the public handler.

### Decision: Revalidation (REVISED after live testing found the first approach didn't work)

**Original choice** (built, then disproven): tag `src/lib/courses/read.ts`'s
Drizzle queries via `unstable_cache(fn, keyParts, { tags: ['courses'] })`,
and call `revalidateTag('courses', 'max')` from every admin write.

**What actually happened**: end-to-end Playwright testing against the real
Supabase DB (publish a course, then immediately check the public site)
showed the public page still didn't show the change. Per Next.js 16's own
`revalidateTag` docs, `profile="max"` is explicitly **stale-while-
revalidate** — "the next request... is served stale content while it
runs" — so even a correctly-tagged cache wouldn't show the change on the
very next request, only a later one. Next.js 16's own `updateTag` docs
(the read-your-writes-focused alternative) only document `fetch`'s
`next.tags` and `cacheTag()` as tag sources — `unstable_cache`'s `tags`
option is never mentioned as compatible with either function, so beyond
the staleness issue there's a real, unconfirmed compatibility question
between the legacy `unstable_cache` tagging and Next 16's tag-invalidation
functions.

**Revised choice**: drop caching entirely for these reads (plain Drizzle
queries, no `unstable_cache`), and drop `generateStaticParams` from the
category/detail pages (`export const dynamic = "force-dynamic"` instead)
so a brand-new course also gets a page immediately, not just on the next
build. Admin write Server Actions no longer call `revalidateTag`; the two
that don't already `redirect()` (`setCourseStatus`, `deleteCourse`) have
their client callers (`PublishToggleButton`, `DeleteCourseButton`) call
`router.refresh()` after the action resolves, to refresh the admin list
view specifically (the Router Cache, a separate concern from the Data
Cache this whole decision was originally about).

**Alternatives considered**: `revalidatePath` per affected page;
`updateTag` instead of `revalidateTag` (would fix the staleness window if
compatible with `unstable_cache`, but that compatibility is unconfirmed
and not worth re-testing against); adopting `cacheComponents: true` + the
`use cache` directive + `cacheTag()` (the docs warn it "can surface build
errors for uncached data outside of `<Suspense>`" and requires adopting
the whole Cache Components model — too big a change for what this needed).

**Rationale**: this project's traffic (a personal site) makes a live
Postgres query per request cheap; correctness and simplicity clearly beat
a caching layer whose invalidation semantics turned out to be more
subtle, and less documented for our exact usage, than expected. Verified
end-to-end after the fix: publish → visible on the public site on the
very next request, no delay.

### Decision: Testing DB-touching code without a live Supabase instance in CI

**Choice**: pure logic (Zod validation, status-transition rules, the
sign-up-block route guard) is unit-tested with Vitest, no DB involved.
Actual Drizzle queries against Supabase are verified once manually (a real
runtime-harness run against the user's Supabase project), documented as
evidence — same pattern used for course-catalog-mvp's static-HTML check.
**Alternatives considered**: `pg-mem` in-memory Postgres for full
integration tests.
**Rationale**: proportional to a solo project with no CI service yet;
`pg-mem` is a real option to revisit if this grows a CI pipeline.

### Decision: Supabase connection — pooler URL, not the direct DB URL

**Choice**: connect via `drizzle-orm/postgres-js` (the `postgres` npm
package), using Supabase's **connection pooler** URL
(`*.pooler.supabase.com`, port 6543) with `prepare: false` when creating
the `postgres` client.
**Alternatives considered**: Supabase's direct Postgres connection string.
**Rationale**: Next.js server actions/route handlers run as short-lived
serverless invocations; the direct URL doesn't handle that connection
churn well, while the pooler (pgBouncer) does. `prepare: false` is
required for pgBouncer compatibility — prepared statements aren't safe
across pooled connections. Verified against Drizzle's own Supabase docs
(`research.md`).

## Data Flow

    Admin form ──▶ Server Action ──▶ Drizzle (Supabase) ──▶ revalidateTag('courses')
                                                              │
    scripts/sync-youtube.ts ──▶ Drizzle insert (status=pending)
                                                              │
                                                              ▼
                                    Next.js ISR read (published-only, tag: courses)
                                                              │
                                                              ▼
                                        Public: home / [category] / [category]/[slug]

## File Changes

| File | Action | Description |
|------|--------|--------------|
| `src/lib/db/schema.ts` | Create | Drizzle schema: `courses`, `categories`, Better Auth tables |
| `src/lib/db/client.ts` | Create | `postgres-js` driver (Supabase pooler URL, `prepare: false`) + Drizzle client |
| `src/lib/auth/config.ts` | Create | Better Auth config (Drizzle adapter, email/password only) |
| `src/app/api/auth/[...all]/route.ts` | Create | Better Auth handler, sign-up path blocked |
| `scripts/seed-admin.ts` | Create | One-off: creates the single admin user |
| `src/app/admin/layout.tsx` | Create | Session gate for all `/admin/**` |
| `src/app/admin/login/page.tsx` | Create | Login form |
| `src/app/admin/page.tsx` | Create | Course list (all statuses) |
| `src/app/admin/courses/new/page.tsx`, `[id]/edit/page.tsx` | Create | Create/edit forms |
| `src/app/admin/actions.ts` | Create | Server Actions: create/update/delete/publish/unpublish |
| `src/lib/courses/read.ts` | Modify | Filesystem → Drizzle, `published`-only filter, tagged reads |
| `scripts/sync-youtube.ts` | Modify | JSON write → Drizzle insert, `status: pending` |
| `content/courses/**` | Remove | Superseded by DB, after migration verified |
| `drizzle/*.sql`, `drizzle.config.ts` | Create | Migration history + config |

## Interfaces / Contracts

```typescript
// src/lib/db/schema.ts (Drizzle, illustrative)
export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  platform: text("platform", { enum: ["youtube", "udemy"] }).notNull(),
  category: text("category").notNull(),
  sourceUrl: text("source_url").notNull(),
  freeStatus: text("free_status", { enum: ["free"] }).notNull().default("free"),
  status: text("status", { enum: ["pending", "published"] }).notNull().default("pending"),
  lastVerifiedAt: date("last_verified_at").notNull(),
  youtubeVideoId: text("youtube_video_id"),
  youtubeChannelId: text("youtube_channel_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|--------------|----------|
| Unit | Course Zod schema (unchanged rules + new `status`) | Vitest, extends existing `schema.test.ts` |
| Unit | Sign-up path is rejected by the handler guard | Vitest, calls the guard function directly with a sign-up path |
| Unit | Publish/unpublish is a pure status transition | Vitest |
| Integration | Login → `/admin` → create → publish → visible on public page | Manual runtime harness (real Supabase project), documented as evidence |
| Migration | Existing committed course migrates with matching fields | One-off script + manual diff check before deleting `content/` |

## Threat Matrix

N/A — no shell/subprocess/VCS/PR automation or executable-file
classification boundary in this change (route protection is ordinary
Next.js session-gating, not the shell/process-integration class the
matrix targets).

## Migration / Rollout

1. Provision a Supabase project, run Drizzle migrations against its
   **pooler** connection string (courses, categories, Better Auth tables).
2. Seed categories from `content/categories.json`.
3. Migrate the one existing course JSON file into a row (`status: published`).
4. Run `scripts/seed-admin.ts` once, with credentials from local env, not committed.
5. Verify admin login + public site both work against the DB.
6. Only then delete `content/courses/**` and retire the JSON-reading code path.

## Open Questions

- [ ] Whether a Better Auth "disable sign-up" plugin exists that would
      replace the manual route guard — worth one more doc pass before
      writing the guard, doesn't block starting other tasks.
