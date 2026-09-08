# Admin Auth Specification

## Purpose

Single-admin authentication (Better Auth) protecting the admin panel. No
public accounts: exactly one admin user, seeded server-side, no
self-registration.

## Requirements

### Requirement: Only the seeded admin can authenticate

The system MUST authenticate exactly one pre-seeded admin user via
email/password. No sign-up flow MUST be reachable, whether through UI or a
direct request to an auth endpoint.

#### Scenario: Correct credentials succeed

- GIVEN the seeded admin's email and password
- WHEN submitted at the login form
- THEN a session is created and the admin is redirected into `/admin`

#### Scenario: Wrong credentials are rejected

- GIVEN an incorrect password for the seeded admin email
- WHEN submitted at the login form
- THEN authentication fails and no session is created

#### Scenario: Sign-up endpoint is blocked

- GIVEN any request to the auth sign-up endpoint (UI or direct HTTP)
- WHEN it is received
- THEN the system MUST reject it (no new user is created), regardless of
  whether the underlying auth library would otherwise allow it

### Requirement: Admin routes require a valid session

Every route under `/admin` (pages, server actions, and any admin-only API
route) MUST require a valid Better Auth session; an unauthenticated
request MUST be redirected to the login page rather than served.

#### Scenario: Unauthenticated request is redirected

- GIVEN no valid session cookie
- WHEN `/admin` or any sub-route is requested
- THEN the response redirects to the login page, and no admin data or UI
  is exposed in the response

#### Scenario: Valid session is admitted

- GIVEN a valid session from the seeded admin's login
- WHEN an `/admin` route is requested
- THEN the request is served normally

### Requirement: Sessions expire and can be revoked

Sessions MUST have a bounded lifetime and MUST be invalidated on logout.

#### Scenario: Logout ends the session

- GIVEN an authenticated admin session
- WHEN the admin logs out
- THEN the session is invalidated and subsequent `/admin` requests are
  redirected to login
