"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  ADSENSE_CLIENT_ID,
  getConsentServerSnapshot,
  getConsentSnapshot,
  subscribeToConsent,
} from "@/components/analytics/gtag";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * One AdSense ad unit, gated by the same consent choice as analytics
 * (ConsentGate) — renders nothing at all until: (1) a publisher id is
 * configured (NEXT_PUBLIC_ADSENSE_CLIENT_ID), (2) this specific slot has
 * an id (passed as a prop, itself normally read from its own env var by
 * the caller — see src/app/page.tsx), and (3) the visitor accepted.
 * Framed as a labeled card like everything else in the catalog, not a
 * bare foreign banner.
 */
export function AdSlot({ slotId, label = "Publicidad" }: { slotId?: string; label?: string }) {
  const choice = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getConsentServerSnapshot
  );
  const canShow = Boolean(ADSENSE_CLIENT_ID) && Boolean(slotId) && choice === "granted";

  useEffect(() => {
    if (!canShow) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle.js not loaded yet (or blocked) — fail silently rather
      // than show a broken ad container.
    }
  }, [canShow]);

  if (!canShow) return null;

  return (
    <div className="border border-rule bg-card p-3">
      <span className="mb-2 block font-mono text-[10px] text-ink-muted">{label}</span>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
