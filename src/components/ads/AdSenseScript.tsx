import Script from "next/script";
import { ADSENSE_CLIENT_ID } from "@/components/analytics/gtag";

/**
 * Loads AdSense's own script for every visitor, unconditionally — ad
 * consent for EEA/UK/CH visitors is Google's own Funding Choices CMP's
 * job (a separate script Google gives you from AdSense → Privacy &
 * messaging), not our analytics consent banner (ConsentGate). Funding
 * Choices needs adsbygoogle.js present to do that, so it can't be gated
 * behind our own "Aceptar" click the way GTM is.
 *
 * TODO: once Funding Choices is set up, add its snippet here too (same
 * pattern) — ask before pasting anything, it's publisher-specific.
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
