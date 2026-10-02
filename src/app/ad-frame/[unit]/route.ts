import { ADSTERRA_BANNERS, bannerDocument, isAdsterraBannerName } from "@/components/ads/adsterra";

// Standalone page for one Adsterra banner, framed by AdsterraBanner.
// Served from this domain (not a srcDoc iframe) because Adsterra's script
// checks the page's location and serves nothing on `about:srcdoc`.
export async function GET(_request: Request, { params }: { params: Promise<{ unit: string }> }) {
  const { unit } = await params;
  if (!isAdsterraBannerName(unit)) return new Response("Not found", { status: 404 });
  return new Response(bannerDocument(ADSTERRA_BANNERS[unit]), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "noindex",
    },
  });
}
