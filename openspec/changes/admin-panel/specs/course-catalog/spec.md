# Delta for Course Catalog

## MODIFIED Requirements

### Requirement: Course record shape

Each course record MUST store: title, platform (`youtube` | `udemy`),
category, source URL, `free_status`, `last_verified_at` (date), and
`status` (`pending` | `published`).
(Previously: record shape had no `status` field — every committed record
was implicitly published via git/PR review.)

#### Scenario: Missing required field blocks publish

- GIVEN an ingested/curated record missing `title`, `source URL`, or
  `last_verified_at`
- WHEN the ingestion pipeline attempts to publish it
- THEN the record MUST be rejected and MUST NOT appear on the site

## ADDED Requirements

### Requirement: Published-only public listing

The public site (home, category, course-detail pages) MUST only render
course records whose `status` is `published`. A `pending` record MUST NOT
appear anywhere a visitor can reach it, including direct navigation to its
detail URL.

#### Scenario: Pending course is invisible to visitors

- GIVEN a course record with `status = pending`
- WHEN a visitor requests its category page or its own detail URL
- THEN the record does not appear on the category page, and its direct
  detail URL returns not-found

#### Scenario: Publishing makes it visible

- GIVEN a `pending` course record
- WHEN an admin publishes it (`status` becomes `published`)
- THEN the record appears on the public site without requiring a full
  redeploy
