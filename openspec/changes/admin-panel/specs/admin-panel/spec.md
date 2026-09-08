# Admin Panel Specification

## Purpose

Authenticated CRUD UI for course records: list everything (any status),
create, edit, delete, and publish/unpublish — replacing hand-edited JSON
files as the way the catalog is managed.

## Requirements

### Requirement: List every course regardless of status

The admin course list MUST show every course record — `pending` and
`published` — with its status visibly distinguished, unlike the public
site which shows only `published` rows.

#### Scenario: Pending and published both listed

- GIVEN a database containing both `pending` and `published` course
  records
- WHEN the admin opens the course list
- THEN both appear, each labeled with its status

### Requirement: Create and edit validate the same shape as ingestion

Creating or editing a course record through the admin UI MUST validate
against the same required fields as the `course-catalog` record shape
(title, platform, category, source URL, `free_status`, `last_verified_at`,
`status`); an invalid submission MUST be rejected with a visible error,
not silently dropped or partially saved.

#### Scenario: Missing required field is rejected

- GIVEN an admin submits a course form missing the title
- WHEN the form is submitted
- THEN the record is not saved, and the admin sees which field is missing

#### Scenario: Valid edit updates the public site without a redeploy

- GIVEN a published course record
- WHEN an admin edits its title and saves
- THEN the public course-detail page reflects the new title without a
  full site redeploy

### Requirement: Publish/unpublish toggles public visibility

The admin panel MUST let an admin change a course's `status` between
`pending` and `published` without editing any other field.

#### Scenario: Publishing a pending course

- GIVEN a `pending` course record
- WHEN the admin publishes it
- THEN its `status` becomes `published` and it appears on the public site

#### Scenario: Unpublishing a live course

- GIVEN a `published` course record that stopped being free
- WHEN the admin unpublishes it
- THEN its `status` becomes `pending` and it no longer appears on the
  public site, but the record itself is not deleted

### Requirement: Delete removes a record entirely

The admin panel MUST support permanently deleting a course record, with a
confirmation step to prevent accidental deletion.

#### Scenario: Delete requires confirmation

- GIVEN an admin clicks delete on a course record
- WHEN the action is triggered
- THEN the admin MUST confirm before the record is actually removed

#### Scenario: Deleted course is gone everywhere

- GIVEN a confirmed deletion
- WHEN it completes
- THEN the record no longer appears in the admin list or on the public
  site
