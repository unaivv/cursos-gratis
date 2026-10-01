"use client";

import { useEffect } from "react";
import { ADSENSE_CLIENT_ID } from "@/components/analytics/gtag";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * One AdSense ad unit — renders whenever a publisher id and this specific
 * slot's id are both configured (see env vars, e.g. NEXT_PUBLIC_ADSENSE_
 * SLOT_HOME, read by the caller). Ad consent comes from the TCF CMP
 * (see AdSenseScript), read by adsbygoogle.js itself. Framed as a labeled card like
 * everything else in the catalog, not a bare foreign banner.
 */
export function AdSlot({ slotId, label = "Publicidad" }: { slotId?: string; label?: string }) {
  const canShow = Boolean(ADSENSE_CLIENT_ID) && Boolean(slotId);

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
