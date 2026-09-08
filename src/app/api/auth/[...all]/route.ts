import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth/config";
import { isSignUpPath } from "@/lib/auth/guards";

/**
 * Spec: openspec/changes/admin-panel/specs/admin-auth/spec.md —
 * "Only the seeded admin can authenticate" / "Sign-up endpoint is
 * blocked". The one admin user is created by scripts/seed-admin.ts,
 * never through this endpoint. See src/lib/auth/guards.ts.
 */
const betterAuthHandler = toNextJsHandler(auth);

export async function GET(
  request: Request,
  context: { params: Promise<{ all: string[] }> }
) {
  const { all } = await context.params;
  if (isSignUpPath(all)) {
    return new Response("Not found", { status: 404 });
  }
  return betterAuthHandler.GET(request);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ all: string[] }> }
) {
  const { all } = await context.params;
  if (isSignUpPath(all)) {
    return new Response("Not found", { status: 404 });
  }
  return betterAuthHandler.POST(request);
}
