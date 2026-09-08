# Delta for Content Ingestion

## MODIFIED Requirements

### Requirement: YouTube sync writes pending records, review moves to the admin panel

The YouTube ingestion job MUST discover videos/playlists only from an
explicit, maintained list of channel/playlist IDs (via `playlistItems.list`
/ `videos.list`), and MUST NOT rely on `search.list` as its primary
discovery mechanism, given the 100-call/day quota bucket on that endpoint.
Every record it writes MUST have `status = pending`; a human MUST publish
it from the admin panel before it is publicly visible.
(Previously: the sync job wrote git-committed JSON files whose review
happened as a GitHub pull request; there was no `status` concept because
every committed record was implicitly reviewed-and-live.)

#### Scenario: Sync pulls from a curated channel

- GIVEN a channel ID present in the curated source list
- WHEN the sync job runs
- THEN it fetches that channel's playlist contents via `playlistItems.list`
- AND it does not call `search.list` for discovery

#### Scenario: Quota exhaustion is handled gracefully

- GIVEN the daily quota for the sync job's API calls is exhausted
- WHEN the job attempts a further call
- THEN it MUST stop and log the exhaustion rather than fail silently or
  crash the process

#### Scenario: New sync result is not public until reviewed

- GIVEN the sync job inserts a new course record
- WHEN it is written
- THEN its `status` is `pending`, and it does not appear on the public
  site until an admin publishes it

### Requirement: Udemy curation is manual, entered through the admin panel

Udemy course records MUST be entered through the authenticated admin
panel (no automated API fetch, per `research.md`), and each record MUST
carry a `last_verified_at` date that the admin is responsible for
refreshing. A newly-created Udemy record MAY be saved directly as
`published` (the admin is the human reviewer at creation time).
(Previously: Udemy records were added as hand-written JSON files
committed directly to git, with no separate review step and no `status`
field.)

#### Scenario: New Udemy course added

- GIVEN an admin confirms a Udemy course is free (manual check)
- WHEN they create the record in the admin panel
- THEN `platform = udemy`, `free_status = free`, and `last_verified_at` are
  set to the confirmation date

#### Scenario: Stale Udemy record flagged

- GIVEN a Udemy record whose `last_verified_at` is older than the
  re-verification interval defined in `openspec/config.yaml`
- WHEN the admin panel's course list renders
- THEN the record MUST be visibly flagged for re-check (not automatically
  unpublished, since removal without a check could drop a course that is
  still free)

## Requirements unchanged by this delta

`YouTube records store provenance` and `Ingestion pipeline is idempotent`
(from `course-catalog-mvp`) are storage-agnostic as written and continue
to apply unchanged against the new database-backed storage.
