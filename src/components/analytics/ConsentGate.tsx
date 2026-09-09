"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Script from "next/script";
import {
  ADSENSE_CLIENT_ID,
  GTM_ID,
  getConsentServerSnapshot,
  getConsentSnapshot,
  storeConsent,
  subscribeToConsent,
} from "./gtag";

/**
 * Minimal EU-compliant cookie-consent gate for Google Tag Manager AND
 * Google AdSense (design.md — Decision: Outbound click tracking; ads
 * added later, same gate). Both share one consent choice: nothing loads
 * until the visitor accepts, declining keeps the site fully functional
 * with neither. No `<noscript>` fallback iframe — Google's default GTM
 * snippet loads it unconditionally, which would track visitors with JS
 * disabled without ever showing them the consent banner (itself a client
 * component). Skipping it keeps "no consent → no tracking/ads" actually
 * true.
 */
export function ConsentGate() {
  const choice = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getConsentServerSnapshot
  );

  const hasAnythingToGate = Boolean(GTM_ID) || Boolean(ADSENSE_CLIENT_ID);
  if (!hasAnythingToGate || choice === "denied") return null;

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
            Usamos cookies de analítica y publicidad para medir qué fichas se usan y
            mostrar anuncios. Puedes rechazarlas sin que deje de funcionar el catálogo —
            ver <Link href="/privacidad" className="underline underline-offset-2 hover:text-stamp-red">política de privacidad</Link>.
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
    <>
      {GTM_ID && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
      )}
      {ADSENSE_CLIENT_ID && (
        <Script
          id="adsense-init"
          strategy="afterInteractive"
          async
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
        />
      )}
    </>
  );
}
