import { NextResponse, type NextRequest } from "next/server";
import { canonicalRedirect } from "@/lib/canonical-host";

// Permanent (301) redirect from legacy hosts to the canonical domain —
// see canonicalRedirect. The Host header is used (not request.url): behind
// the Cloudflare tunnel the app sees its local listen address in the URL.
export function proxy(request: NextRequest) {
  const target = canonicalRedirect(
    request.headers.get("host"),
    request.nextUrl.pathname,
    request.nextUrl.search
  );
  return target ? NextResponse.redirect(target, 301) : NextResponse.next();
}
