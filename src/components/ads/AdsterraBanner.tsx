"use client";

import { useSyncExternalStore } from "react";
import {
  getConsentServerSnapshot,
  getConsentSnapshot,
  subscribeToConsent,
} from "@/components/analytics/gtag";
import {
  ADSTERRA_BANNERS,
  ADSTERRA_DISABLED,
  LEADERBOARD_MEDIA_QUERY,
  type AdsterraBannerName,
} from "./adsterra";

/**
 * True once the TCF CMP reports consent (same signal as ConsentGate) and
 * the kill switch is off. "pending" on the server and during hydration, so
 * ads never render server-side and there's no hydration mismatch. Units
 * render nothing until then rather than a reserved box: visitors who
 * reject would otherwise keep an empty "Publicidad" frame forever, and
 * the only layout shift left is the one right after accepting.
 */
export function useAdsterraAllowed(): boolean {
  const consent = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, getConsentServerSnapshot);
  return !ADSTERRA_DISABLED && consent === "granted";
}

/**
 * One Adsterra iframe banner of a fixed size, loaded from its own page on
 * this domain (/ad-frame/[unit] — Adsterra serves nothing to a sandboxed
 * srcDoc frame), framed as a labeled card like AdSlot. Not sandboxed: the
 * frame is same-origin by necessity, and the native unit already runs
 * Adsterra's script in the main page anyway.
 */
export function AdsterraBanner({ name, className = "" }: { name: AdsterraBannerName; className?: string }) {
  const allowed = useAdsterraAllowed();
  if (!allowed) return null;
  const unit = ADSTERRA_BANNERS[name];

  return (
    <aside aria-label="Publicidad" className={`flex justify-center ${className}`}>
      <div className="max-w-full overflow-hidden border border-rule bg-card px-1 pb-1 pt-2 sm:p-3">
        <span className="mb-2 block font-mono text-[10px] text-ink-muted">Publicidad</span>
        <iframe
          title="Publicidad"
          src={`/ad-frame/${name}`}
          width={unit.width}
          height={unit.height}
          loading="lazy"
          className="block border-0"
          style={{ width: unit.width, height: unit.height }}
        />
      </div>
    </aside>
  );
}

function subscribeToMedia(onChange: () => void): () => void {
  const media = window.matchMedia(LEADERBOARD_MEDIA_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * 728x90 on wide screens, 320x50 below. Picked with matchMedia rather than
 * a CSS toggle so only one banner's scripts load; the server snapshot is
 * null (no window), and the banner only renders after consent anyway, so
 * the server and hydration render agree.
 */
export function AdsterraLeaderboard({ className = "" }: { className?: string }) {
  const wide = useSyncExternalStore<boolean | null>(
    subscribeToMedia,
    () => window.matchMedia(LEADERBOARD_MEDIA_QUERY).matches,
    () => null
  );
  if (wide === null) return null;

  // Below the breakpoint the 320x50 card bleeds into the px-6 gutter so it
  // fits 360px-wide phones.
  return wide ? (
    <AdsterraBanner key="leaderboard" name="leaderboard" className={className} />
  ) : (
    <AdsterraBanner key="mobile" name="mobileLeaderboard" className={`-mx-6 sm:mx-0 ${className}`} />
  );
}
