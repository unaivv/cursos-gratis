// AdSense requires an ads.txt at the domain root once approved,
// declaring the publisher relationship. Empty until
// NEXT_PUBLIC_ADSENSE_CLIENT_ID is set, so this is safe to ship before
// approval — nothing to declare yet.
export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const pubId = clientId?.replace(/^ca-/, "");
  const body = pubId ? `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n` : "";
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
}
