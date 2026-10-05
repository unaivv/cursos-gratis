import { MONEYTIZER_ADS_TXT } from "./moneytizer";

// OWNERDOMAIN must name the domain serving this file: the site answers on
// both cursosgratis.pro and the legacy cursos.unaividal.com.
function ownerDomain(host: string | null): string {
  return host?.endsWith("unaividal.com") ? "unaividal.com" : "cursosgratis.pro";
}

// ads.txt declares every seller authorised to sell this domain's inventory.
// The Moneytizer lines are always served; the AdSense line is appended once
// NEXT_PUBLIC_ADSENSE_CLIENT_ID is set (Moneytizer asks to keep it alongside).
export async function GET(request: Request) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const pubId = clientId?.replace(/^ca-/, "");
  const adsense = pubId ? `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n` : "";
  const owner = ownerDomain(request.headers.get("host"));
  const body = `${MONEYTIZER_ADS_TXT.replace(/^OWNERDOMAIN=.*$/m, `OWNERDOMAIN=${owner}`)}\n${adsense}`;
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
}
