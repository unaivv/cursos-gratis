// Design decision: Google Tag Manager for outbound-click tracking (GA4,
// or anything else, gets wired up as a tag inside the GTM container —
// not in this code). See openspec/changes/course-catalog-mvp/design.md
// — Decision: Outbound click tracking.

declare global {
  interface Window {
    dataLayer?: unknown[];
    __tcfapi?: TcfApi;
  }
}

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
// Google AdSense publisher id (ca-pub-...). Ad consent is read by the ad
// tags themselves from the TCF CMP (moneytizerCmp.ts), not from this module.
export const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export type ConsentSnapshot = "granted" | "denied" | "pending";

// Subset of the IAB TCF v2 `TCData` object this site reads.
interface TcData {
  eventStatus?: "tcloaded" | "cmpuishown" | "useractioncomplete";
  gdprApplies?: boolean;
  purpose?: { consents?: Record<string, boolean> };
}
type TcfApi = (
  command: string,
  version: number,
  callback: (tcData: TcData, success: boolean) => void
) => void;

// TCF purpose 1 = "Store and/or access information on a device" — the
// one GTM's cookies need. Outside GDPR (gdprApplies === false) there is
// nothing to ask, so analytics is allowed.
function consentFromTcData(tcData: TcData): ConsentSnapshot | null {
  if (tcData.eventStatus !== "tcloaded" && tcData.eventStatus !== "useractioncomplete") {
    return null;
  }
  if (tcData.gdprApplies === false) return "granted";
  return tcData.purpose?.consents?.["1"] ? "granted" : "denied";
}

// Minimal external store over the CMP's `__tcfapi` events so ConsentGate
// can react via `useSyncExternalStore` (see
// https://react.dev/reference/react/useSyncExternalStore). Stays "pending"
// if the CMP never loads (blocked) — no consent signal, no tracking.
const listeners = new Set<() => void>();
let snapshot: ConsentSnapshot = "pending";
let listening = false;

function listenToCmp(): void {
  if (listening || typeof window === "undefined") return;
  if (!window.__tcfapi) {
    // CMP stub not executed yet — try once more after the page loads.
    window.addEventListener("load", listenToCmp, { once: true });
    return;
  }
  listening = true;
  window.__tcfapi("addEventListener", 2, (tcData, success) => {
    if (!success) return;
    const next = consentFromTcData(tcData);
    if (!next || next === snapshot) return;
    snapshot = next;
    for (const listener of listeners) listener();
  });
}

export function subscribeToConsent(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  listenToCmp();
  return () => listeners.delete(onStoreChange);
}

export function getConsentSnapshot(): ConsentSnapshot {
  return snapshot;
}

export function getConsentServerSnapshot(): ConsentSnapshot {
  return "pending";
}

/**
 * Fires the `outbound_click` GA4 event required by spec:
 * course-catalog — Requirement: Outbound click to source platform.
 * Pushed straight to `dataLayer` (the GTM-native way) rather than calling
 * `window.gtag` — GTM doesn't define that shim unless a gtag-based tag is
 * also configured, `dataLayer` is always safe to push to. No-ops if GTM
 * hasn't loaded (consent not granted, or no container ID).
 */
export function trackOutboundClick(params: {
  courseSlug: string;
  platform: "youtube" | "udemy";
}): void {
  if (typeof window === "undefined" || !window.dataLayer) return;
  window.dataLayer.push({
    event: "outbound_click",
    course_slug: params.courseSlug,
    platform: params.platform,
  });
}
