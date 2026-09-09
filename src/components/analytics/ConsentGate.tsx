"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";
import {
  GTM_ID,
  getConsentServerSnapshot,
  getConsentSnapshot,
  storeConsent,
  subscribeToConsent,
} from "./gtag";

/**
 * Minimal EU-compliant cookie-consent gate for Google Tag Manager
 * (design.md — Decision: Outbound click tracking). GTM only loads after
 * the visitor accepts; declining keeps the site fully functional with no
 * tracking script. No `<noscript>` fallback iframe — Google's default
 * snippet loads it unconditionally, which would track visitors with JS
 * disabled without ever showing them the consent banner (itself a client
 * component). Skipping it keeps "no consent → no tracking" actually true.
 *
 * Ad consent is a SEPARATE concern, handled by Google's own Funding
 * Choices CMP (see FundingChoicesScript in layout.tsx) — not this gate.
 * AdSense's script loads unconditionally for everyone; Funding Choices
 * is what shows EEA/UK/CH visitors their own prompt and decides
 * personalized vs. non-personalized ads from that. Gating adsbygoogle.js
 * behind this banner too would mean an EEA visitor accepts here, THEN
 * gets asked again by Google's own prompt — two banners for one thing.
 */
export function ConsentGate() {
  const choice = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getConsentServerSnapshot
  );

  if (!GTM_ID || choice === "denied") return null;

  if (choice === "pending") {
    return (
      <div
        role="dialog"
        aria-label="Aviso sobre cookies"
        className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-dashed border-rule bg-card"
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-ink">
            <span className="font-mono text-xs text-ink-muted">nota — </span>
            Medimos qué fichas se usan con cookies de analítica. Puedes
            rechazarlas sin que deje de funcionar el catálogo.
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => storeConsent("denied")}
              className="border border-rule px-4 py-2 font-sans text-ink-muted hover:text-ink"
            >
              Rechazar
            </button>
            <button
              type="button"
              onClick={() => storeConsent("granted")}
              className="border-2 border-dashed border-stamp-red px-4 py-2 font-sans font-medium text-stamp-red hover:bg-stamp-red hover:text-paper"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // choice === "granted"
  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');
      `}
    </Script>
  );
}
