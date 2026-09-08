## Exploration: Free-course aggregator MVP (cursos-unaividal)

### Current State

Greenfield project. Scaffolded with `create-next-app` (Next.js 16, App Router,
React 19, TypeScript 5, Tailwind CSS 4, ESLint). No domain code, no data
layer, no API integrations, no tests yet. Deploy target: `cursos.unaividal.com`.

### Affected Areas

- `src/app/` — will hold the catalog routes (home, category, course detail).
- `src/lib/` (new) — will hold platform API clients and the course data model.
- `package.json` — will gain dependencies for whichever data-source strategy is chosen.

### Product constraints already fixed by the user

1. Only **free** courses are listed.
2. Every listing MUST use official platform APIs (YouTube Data API v3, Udemy
   Affiliate/Course API) — no scraping.
3. Primary growth channel is SEO; the site must render course/category pages
   as indexable, fast, static-first HTML.
4. Monetization is affiliate/ads-driven, not direct sales (design detail
   deferred to a later change).

### Approaches

1. **Live API fetch at request/build time** — call YouTube/Udemy APIs
   directly for every page render (or at ISR/build time), no local database.
   - Pros: catalog always reflects the source platform (a course that stops
     being free disappears automatically); minimal infra.
   - Cons: YouTube Data API quota (10,000 units/day default) is tight for
     search-heavy queries; Udemy's public API does not reliably expose a
     "free" filter, so most free-Udemy discovery still needs manual curation;
     SEO pages need content stability, and live third-party calls at request
     time hurt render latency and cacheability.
   - Effort: Medium.

2. **Curated catalog with periodic API sync (recommended)** — maintain our
   own course records (title, platform, category, url, free-status,
   last-verified date) in a small database, populated/refreshed by a
   scheduled job that calls the official APIs (and, for Udemy, a manual
   curation step since there is no public "free courses" endpoint). Pages
   render from our own data via SSG/ISR.
   - Pros: full control over SEO metadata and static rendering; resilient to
     API quota limits (sync runs once, not per visitor); can flag/verify
     "still free" on a schedule instead of trusting live calls; supports the
     differentiation angle (niche curation) discussed with the user.
   - Cons: needs a database and a sync job (more moving parts than approach 1);
     staleness window between sync runs (a course could stop being free and
     still show until the next sync).
   - Effort: Medium-High.

3. **Fully manual catalog, no API integration** — hand-entered course list,
   no automated verification against source platforms.
   - Pros: simplest to ship an MVP fast.
   - Cons: violates the user's own constraint #2 in spirit (staleness with
     zero verification), doesn't scale, contradicts the stated goal of
     pulling from multiple platforms systematically.
   - Effort: Low (but discarded — conflicts with stated constraints).

### Recommendation

Approach 2 (curated catalog + scheduled API sync). It is the only option that
satisfies all four fixed constraints simultaneously: official-APIs-only,
SEO-first static rendering, "free only" with periodic re-verification, and
room to grow the affiliate/ads layer later without re-architecting.

### Risks

- Udemy has no public "list all free courses" endpoint — free-course
  discovery there will require a manual/semi-manual curation step, not pure
  API automation. This needs an explicit product decision (see proposal).
- YouTube Data API daily quota caps how often/how broadly the sync job can
  search; needs a bounded query strategy (e.g., track a curated list of
  channels/playlists rather than open-ended search).
- No test runner is configured yet (`strict_tdd: false`); the design/tasks
  phases should decide whether to introduce one before or during apply.

### Ready for Proposal

Yes — with one open product decision to resolve before/at proposal time:
how Udemy free-course discovery is sourced (manual curation list vs.
best-effort API filtering vs. deferring Udemy to a later change and
launching YouTube-only first).
