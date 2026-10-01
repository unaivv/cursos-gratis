import Script from "next/script";
import { ADSENSE_CLIENT_ID } from "@/components/analytics/gtag";

/**
 * Loads AdSense's own script for every visitor. Ad consent is read by
 * adsbygoogle.js itself from the IAB TCF CMP (moneytizerCmp.ts), which
 * decides personalized vs. non-personalized vs. no ads.
 */
export function AdSenseScript() {
  if (!ADSENSE_CLIENT_ID) return null;
  return (
    <Script
      id="adsense-init"
      strategy="afterInteractive"
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
    />
  );
}
