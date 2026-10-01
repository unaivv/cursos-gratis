import { MONEYTIZER_ADS_TXT } from "./moneytizer";

// ads.txt declares every seller authorised to sell this domain's inventory.
// The Moneytizer lines are always served; the AdSense line is appended once
// NEXT_PUBLIC_ADSENSE_CLIENT_ID is set (Moneytizer asks to keep it alongside).
export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const pubId = clientId?.replace(/^ca-/, "");
  const adsense = pubId ? `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n` : "";
  const body = `${MONEYTIZER_ADS_TXT}\n${adsense}`;
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
}
