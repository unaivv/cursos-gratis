# Course Catalog Specification

## Purpose

Defines the course data model and the public browsing/detail pages that let
a visitor discover free courses and click through to the source platform.

## Requirements

### Requirement: Free-only listing

The system MUST NOT list any course record whose `free_status` is not
confirmed free at time of ingestion.

#### Scenario: Paid course is never listed

- GIVEN an ingested course record with `free_status = paid`
- WHEN the catalog renders any page
- THEN that course MUST NOT appear on the site

#### Scenario: Free course appears

- GIVEN an ingested course record with `free_status = free`
- WHEN the catalog renders
- THEN the course appears on its category page and its own detail page

### Requirement: Course record shape

Each course record MUST store: title, platform (`youtube` | `udemy`),
category, source URL, `free_status`, and `last_verified_at` (date).

#### Scenario: Missing required field blocks publish

- GIVEN an ingested/curated record missing `title`, `source URL`, or
  `last_verified_at`
- WHEN the ingestion pipeline attempts to publish it
- THEN the record MUST be rejected and MUST NOT appear on the site

### Requirement: SEO-first rendering

Catalog pages (home, category, course detail) MUST be statically generated
or incrementally regenerated (SSG/ISR); they MUST NOT depend on client-side
data fetching to render primary course content.

#### Scenario: Course detail page is crawlable without JS

- GIVEN a course detail page URL
- WHEN fetched without executing JavaScript
- THEN the course title, platform, and category MUST be present in the
  returned HTML

### Requirement: Outbound click to source platform

Each course detail page MUST provide an outbound link to the course on its
source platform (YouTube or Udemy), and that link MUST be tracked (click
event recorded) to support future affiliate/ads wiring.

#### Scenario: Visitor clicks through

- GIVEN a visitor on a course detail page
- WHEN they click the "go to course" link
- THEN they are navigated to the source platform's course URL
- AND a click event is recorded for that course

### Requirement: Staleness surfacing

The system SHOULD display `last_verified_at` on the course detail page so
visitors can judge freshness of the "still free" claim.

#### Scenario: Verified date shown

- GIVEN a published course record
- WHEN its detail page renders
- THEN the `last_verified_at` date is visible on the page
