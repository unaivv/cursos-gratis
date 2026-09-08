# Proposal: Free-course aggregator MVP

## Intent

Ship a first version of `cursos.unaividal.com`: a catalog site that lets
visitors find **free** courses from YouTube and Udemy in one place, and
sends them onward to the source platform to actually take the course. The
business model is discovery + SEO + eventual affiliate/ad revenue, not
selling anything ourselves.

## Scope

### In Scope

- Course data model (title, platform, category, URL, free-status,
  last-verified date).
- Automated YouTube ingestion via curated channel/playlist IDs (official
  Data API v3), respecting the 100/day `search.list` and 10,000-unit
  general quota.
- Manual editorial ingestion workflow for Udemy free courses (no API —
  discontinued 1/1/2025, see `research.md`).
- Public pages: home, category listing, course detail — SSG/ISR-rendered
  for SEO.
- Outbound click tracking (link to source platform) as a foundation for
  future affiliate wiring.

### Out of Scope

- Any purchase flow, payments, or user accounts.
- Non-free/paid course listings.
- Affiliate program integration itself (link exists, commission wiring is a
  later change).
- Platforms beyond YouTube and Udemy (Coursera, edX, etc. — future change).

## Capabilities

### New Capabilities

- `course-catalog`: data model, storage, and the browsing/detail pages
  (home, category, course) rendered for SEO.
- `content-ingestion`: the YouTube automated sync job and the Udemy manual
  curation workflow that populate `course-catalog`.

### Modified Capabilities

- None (greenfield project).

## Approach

Curated catalog with periodic sync (exploration approach #2): our own
course records, populated by (a) a scheduled job pulling curated
YouTube channel/playlist contents via the official API, and (b) a manual
editorial process for Udemy. Pages render statically (SSG/ISR) from that
data, not from live third-party calls, keeping SEO pages fast and stable.

## Affected Areas

| Area | Impact | Description |
|------|--------|--------------|
| `src/lib/courses/` | New | Course data model + data access |
| `src/lib/ingestion/youtube/` | New | YouTube API sync job |
| `src/app/` | New | Home, category, course-detail routes |
| Database/storage choice | New | Decided in design phase |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| YouTube quota exhaustion | Med | Curated channel/playlist pull, not open search |
| Udemy listings go stale (manual process) | Med | Scheduled re-verification cadence, defined in design |
| Competing directly with Class Central, no differentiation | Med | Niche/positioning decision tracked as a follow-up, not blocking MVP |

## Rollback Plan

Entire change is additive (new project, no production traffic yet). Revert
by not deploying / removing the Vercel (or chosen host) deployment for
`cursos.unaividal.com`; no data migration or external side effects to undo.

## Dependencies

- YouTube Data API v3 credentials (Google Cloud project).
- Hosting/deploy target for `cursos.unaividal.com` (not yet chosen — design
  phase).

## Success Criteria

- [ ] Home + at least one category page render a real, populated catalog.
- [ ] YouTube sync job runs end-to-end against real curated sources.
- [ ] At least one manually curated Udemy course is listed with a
      last-verified date.
- [ ] `npm run build` produces a static/ISR output suitable for SEO (no
      client-only rendering of catalog content).
