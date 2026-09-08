# Proposal: Admin panel with authenticated course management

## Intent

Let the site owner manage the course catalog (list, add, edit, unpublish)
through a web UI instead of hand-editing JSON files and waiting on git/CI —
protected by real login, not "anyone with repo access." This also removes
the current git-JSON content model in favor of a database, per the user's
explicit choice.

## Scope

### In Scope

- Single-admin authentication (Better Auth, email/password, no public
  sign-up, no social login) protecting everything under `/admin`.
- Database-backed course + category storage (Supabase Postgres + Drizzle),
  replacing `content/courses/**/*.json`.
- Admin UI: list all courses (any status), create, edit, delete, and
  publish/unpublish.
- `pending`/`published` status so the YouTube sync job's output still gets
  a review step (replacing the git-PR review it relied on before).
- Public site (`/`, `/[category]`, `/[category]/[slug]`) reads from the
  database instead of the filesystem, showing only `published` rows.
- Instant-visibility edits via Next.js `revalidateTag`/`updateTag` fired
  from admin server actions (no full redeploy needed to see a change).
- One-off migration of the existing committed course + Udemy content
  workflow onto the new schema.

### Out of Scope

- Multi-user roles/permissions (single admin only).
- Category CRUD UI (categories seeded via migration; still config-shaped
  for this change — DB-backed category *editing* is future work).
- Public user accounts of any kind.
- Rewriting `scripts/sync-youtube.ts`'s discovery logic — only its write
  target changes (DB insert as `pending` instead of JSON file write).

## Capabilities

### New Capabilities

- `admin-auth`: Better Auth email/password login, single pre-seeded admin
  user, no public sign-up, session-protected `/admin/**` routes.
- `admin-panel`: authenticated CRUD UI for course records (list/create/
  edit/delete/publish), reading and writing the database.

### Modified Capabilities

- `course-catalog`: requirements shift from "read git JSON" to "read
  published DB rows"; adds the `pending`/`published` status concept.
- `content-ingestion`: YouTube sync writes DB rows with `status: pending`
  instead of JSON files opened as a PR; the "review before live" property
  is preserved via that status flag plus the admin panel, not git.

## Approach

Supabase Postgres + Drizzle ORM for both course data and Better Auth's own
tables (user/session/account/verification — Better Auth's official
Drizzle adapter). Public pages move from build-time SSG to ISR, revalidated
on demand (`revalidateTag`) whenever an admin action changes data, so
edits are visible immediately without a redeploy. Admin routes are
protected by checking the Better Auth session in each admin
page/layout/server action; the sign-up endpoint is blocked at the route
handler regardless of library defaults (see `research.md` Q3).

## Affected Areas

| Area | Impact | Description |
|------|--------|--------------|
| `src/lib/db/` | New | Drizzle schema (courses, categories, Better Auth tables) + client |
| `src/lib/auth/` | New | Better Auth config, session helpers, sign-up block |
| `src/app/admin/**` | New | Login page + protected CRUD UI |
| `src/app/api/auth/[...all]/route.ts` | New | Better Auth Next.js handler |
| `src/lib/courses/read.ts` | Modified | Filesystem reads → Drizzle queries, `published`-only filter |
| `scripts/sync-youtube.ts` | Modified | Write target: JSON file → DB insert (`status: pending`) |
| `.github/workflows/sync-youtube.yml` | Modified/Removed | PR-based review no longer the gate; admin panel is |
| `content/courses/**` | Removed | Superseded by DB (one-time migration) |
| `drizzle/` (migrations) | New | SQL migration history |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Scope exceeds review budget (course-catalog-mvp already did) | High | Plan chained PRs from the start in `sdd-tasks`, not after the fact |
| Better Auth sign-up not actually blockable as designed | Low-Med | Explicit RED test hitting the sign-up endpoint directly, not just UI absence |
| Losing git's audit trail for content changes | Medium | Drizzle migrations + DB `createdAt`/`updatedAt` timestamps are the new trail; acceptable trade for instant edits (user's explicit choice) |
| Secrets management (`DATABASE_URL`, Better Auth secret) | Low | Documented in README; `.env.local` gitignored (verify) |

## Rollback Plan

Additive change on top of an unreleased/undeployed project (nothing in
production yet). Revert by discarding the branch/PRs for this change;
`content/courses/**` removal only happens once the DB migration is
verified working, so the JSON files can be restored from git history if
needed before that point.

## Dependencies

- Supabase account + `DATABASE_URL`.
- Better Auth secret (`BETTER_AUTH_SECRET`) for session signing.

## Success Criteria

- [ ] Logging in at `/admin/login` with the seeded admin credentials
      works; wrong credentials are rejected.
- [ ] `/admin` lists every course (both statuses) from the database.
- [ ] Creating/editing/deleting a course in the admin UI is reflected on
      the public site without a redeploy.
- [ ] A direct POST to the Better Auth sign-up endpoint is rejected.
- [ ] `scripts/sync-youtube.ts` inserts new courses as `status: pending`,
      invisible on the public site until published from the admin UI.
