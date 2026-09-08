# Research: Free-course aggregator MVP (cursos-unaividal)

Date: 2026-09-08

## Q1 — YouTube Data API v3: is search-based discovery viable for a sync job?

**Finding**: As of the current documentation, YouTube Data API v3 projects get
a default quota of **10,000 units/day** for most endpoints, but `search.list`
now sits in a **separate, much smaller bucket — 100 `search.list` calls/day**
by default, at a cost of ~1 unit per call within that bucket. This is a
distinct allocation from the general 10,000-unit pool used by endpoints like
`playlistItems.list`, `videos.list`, and `channels.list`.

**Implication**: an open-ended "search YouTube for free courses" strategy is
capped at ~100 calls/day and won't scale as a discovery mechanism. A
**curated-channel/playlist strategy** (track a maintained list of channel or
playlist IDs and pull their contents via `playlistItems.list`/`videos.list`,
which draw from the larger general pool) is the workable pattern, not open
search. This confirms and sharpens the exploration's recommendation.

**Confidence**: High — sourced directly from Google's own developer docs.

**Sources**:
- https://developers.google.com/youtube/v3/getting-started

## Q2 — Can Udemy's API filter/identify free courses for automated sync?

**Finding — status change, corrects the assumption behind the user's chosen
option**: the **Udemy Affiliate API (v2.0)**, which is the API that exposed
course fields including `is_paid`/price, **was discontinued on 1/1/2025**.
Third-party integrations built on it (e.g. the `pydemy` Python client, the
Content Egg Udemy affiliate module) confirm it as non-functional/deprecated
since that date. The Udemy Affiliate *Program* itself still exists but now
runs through **Impact Network** — a commission/link-tracking layer, not a
course-catalog data API.

**Implication**: "best-effort API filtering" for Udemy — the option
selected earlier in this session — is **not currently executable**: there is
no supported Udemy API left to query for course price/free status. Automated
Udemy discovery via official API is not available today.

**Confidence**: Medium-High — converging evidence (Udemy's own doc page
title/state, an abandoned client library, a deprecated plugin module) but I
could not fetch Udemy's own docs page directly (blocked the request, HTTP
403) to quote it verbatim; the finding rests on secondary sources describing
that page's content plus the observed dead client libraries.

**Sources**:
- https://pypi.org/project/pydemy/ (client library, notes API is discontinued)
- https://github.com/robelasefa/pydemy
- https://ce-docs.keywordrush.com/modules/affiliate/udemy (module marked deprecated)
- https://www.udemy.com/developers/affiliate/ (referenced as the source of the "discontinued since 1/1/2025" statement; direct fetch was blocked by the site, so treat as secondary confirmation, not a verbatim quote)

## Q3 — Does a directly comparable competitor already exist?

**Finding**: **Class Central** aggregates free (or free-to-audit) courses
from roughly 1,500 providers including Coursera, edX, and FutureLearn, and
is explicitly a course *aggregator*, not a provider — the same category of
product proposed here. It is an established, well-known player in exactly
this niche.

**Implication**: differentiation (niche, language, or source-platform focus)
remains necessary, as already discussed with the user before this SDD
session started.

**Confidence**: High.

**Sources**:
- https://www.classcentral.com/report/coursera-free-online-courses/
- https://www.classcentral.com/report/free-certificates/

## Decision needed before proposal

The Udemy strategy chosen in the preflight round ("best-effort API
filtering") is **not viable** given Q2. This must be re-decided before
`sdd-propose` runs, since it changes the MVP's platform scope.

**Resolved (user decision, 2026-09-08)**: MVP ships with both platforms —
YouTube via automated sync (curated channel/playlist IDs, official API) and
Udemy via manual editorial curation (no API dependency). This becomes an
explicit product decision carried into the proposal.
