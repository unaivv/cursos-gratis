/**
 * Spec: admin-auth — "Sign-up endpoint is blocked". Better Auth's
 * `emailAndPassword.enabled: true` has no documented flag to expose
 * sign-in without also exposing sign-up (research.md Q3), so this guard
 * rejects the sign-up path at the route handler regardless of library
 * defaults. `all` is the Next.js catch-all route's path segments after
 * `/api/auth/` — e.g. a request to `/api/auth/sign-up/email` yields
 * `all = ["sign-up", "email"]`.
 */
export function isSignUpPath(all: string[]): boolean {
  return all[0] === "sign-up";
}
