import { ADSENSE_CLIENT_ID } from "@/components/analytics/gtag";

/**
 * Loads AdSense's own script for every visitor. Ad consent is read by
 * adsbygoogle.js itself from the IAB TCF CMP (moneytizerCmp.ts), which
 * decides personalized vs. non-personalized vs. no ads.
 *
 * A plain async <script> (React hoists it into <head>) rather than
 * next/script: AdSense's site verification looks for this exact tag in
 * the server-rendered HTML, and next/script only emits a preload there.
 */
export function AdSenseScript() {
  if (!ADSENSE_CLIENT_ID) return null;
  return (
    <script
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
    />
  );
}
