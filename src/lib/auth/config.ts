import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db/client";

/**
 * Single-admin auth. Design: openspec/changes/admin-panel/design.md.
 *
 * `emailAndPassword.enabled` turns on both sign-in AND Better Auth's
 * auto-generated sign-up endpoints together (no documented flag to split
 * them — see research.md Q3). The sign-up path is blocked separately at
 * the route handler (src/app/api/auth/[...all]/route.ts); the one admin
 * user is created out-of-band by scripts/seed-admin.ts, never through
 * this public flow.
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET,
});
