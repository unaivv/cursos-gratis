# Content Ingestion Specification

## Purpose

Defines how course records enter the catalog: automated YouTube sync via
the official API, and manual editorial curation for Udemy (no supported
API — see `research.md`).

## Requirements

### Requirement: YouTube sync uses curated sources, not open search

The YouTube ingestion job MUST discover videos/playlists only from an
explicit, maintained list of channel/playlist IDs (via `playlistItems.list`
/ `videos.list`), and MUST NOT rely on `search.list` as its primary
discovery mechanism, given the 100-call/day quota bucket on that endpoint.

#### Scenario: Sync pulls from a curated channel

- GIVEN a channel ID present in the curated source list
- WHEN the sync job runs
- THEN it fetches that channel's playlist contents via `playlistItems.list`
- AND it does not call `search.list` for discovery

#### Scenario: Quota exhaustion is handled gracefully

- GIVEN the daily quota for the sync job's API calls is exhausted
- WHEN the job attempts a further call
- THEN it MUST stop and log the exhaustion rather than fail silently or
  crash the site build

### Requirement: YouTube records store provenance

Every YouTube-sourced course record MUST store the source video/playlist ID
and the channel ID it came from, in addition to the fields in
`course-catalog`.

#### Scenario: Record traceable to source

- GIVEN a published YouTube course record
- WHEN inspected
- THEN its source video ID and channel ID are present

### Requirement: Udemy curation is manual, with mandatory re-verification

Udemy course records MUST be entered through a manual editorial workflow
(no automated API fetch, per `research.md`), and each record MUST carry a
`last_verified_at` date that the editor is responsible for refreshing.

#### Scenario: New Udemy course added

- GIVEN an editor confirms a Udemy course is free (manual check)
- WHEN they add the record
- THEN `platform = udemy`, `free_status = free`, and `last_verified_at` are
  set to the confirmation date

#### Scenario: Stale Udemy record flagged

- GIVEN a Udemy record whose `last_verified_at` is older than the
  re-verification interval defined in `openspec/config.yaml`
- WHEN the ingestion/build process runs
- THEN the record MUST be flagged for editorial re-check (not
  automatically removed, since removal without a check could drop a course
  that is still free)

### Requirement: Ingestion pipeline is idempotent

Re-running the YouTube sync or re-saving a manually curated Udemy record
MUST NOT create duplicate course records for the same source ID.

#### Scenario: Sync re-run does not duplicate

- GIVEN a video already ingested in a prior sync run
- WHEN the sync job runs again and encounters the same video ID
- THEN the existing record is updated in place, not duplicated
