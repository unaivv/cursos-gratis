// Bing Webmaster ownership file — must also answer on the legacy host,
// so it is exempt from the canonical redirect (lib/canonical-host.ts).
const BING_AUTH_CODE = "BFDF81857CEA01A01F45A2C9379D42A1";

export function GET() {
  const body = `<?xml version="1.0"?>\n<users>\n\t<user>${BING_AUTH_CODE}</user>\n</users>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
