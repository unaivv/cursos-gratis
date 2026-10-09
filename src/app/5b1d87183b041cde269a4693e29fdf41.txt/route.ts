import { INDEXNOW_KEY } from "@/lib/seo/indexnow";

// IndexNow key file: proves ownership of the host for URL submissions.
// A route, not public/: the standalone server doesn't serve public/ here.
export function GET() {
  return new Response(INDEXNOW_KEY, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
