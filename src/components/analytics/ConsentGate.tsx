"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";
import {
  GTM_ID,
  getConsentServerSnapshot,
  getConsentSnapshot,
  subscribeToConsent,
} from "./gtag";

/**
 * Loads Google Tag Manager only once the TCF CMP (moneytizerCmp — the
 * site's single consent banner) reports consent for device storage.
 * Rejecting, or the CMP never loading, keeps the site fully functional
 * with no tracking script. No `<noscript>` fallback iframe — Google's
 * default snippet loads it unconditionally, which would track visitors
 * with JS disabled without ever asking them. Skipping it keeps "no
 * consent → no tracking" actually true.
 */
export function ConsentGate() {
  const choice = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getConsentServerSnapshot
  );

  if (!GTM_ID || choice !== "granted") return null;

  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');
      `}
    </Script>
  );
}
