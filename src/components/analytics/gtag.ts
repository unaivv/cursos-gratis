// Design decision: Google Tag Manager for outbound-click tracking (GA4,
// or anything else, gets wired up as a tag inside the GTM container —
// not in this code). See openspec/changes/course-catalog-mvp/design.md
// — Decision: Outbound click tracking.

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

const CONSENT_STORAGE_KEY = "cursos-unaividal:analytics-consent";

export type ConsentChoice = "granted" | "denied";
export type ConsentSnapshot = ConsentChoice | "pending";

function readStoredConsent(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

// Minimal external store so the consent banner can read/react to
// localStorage via `useSyncExternalStore` instead of setState-in-effect
// (an external, client-only source of truth is exactly what that hook is
// for — see https://react.dev/reference/react/useSyncExternalStore).
const listeners = new Set<() => void>();
let cachedSnapshot: ConsentSnapshot = "pending";
let hydrated = false;

export function subscribeToConsent(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function getConsentSnapshot(): ConsentSnapshot {
  if (!hydrated) {
    cachedSnapshot = readStoredConsent() ?? "pending";
    hydrated = true;
  }
  return cachedSnapshot;
}

export function getConsentServerSnapshot(): ConsentSnapshot {
  return "pending";
}

export function storeConsent(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // localStorage unavailable (private mode, blocked) — consent banner
    // will just re-prompt next visit. Not fatal.
  }
  cachedSnapshot = choice;
  for (const listener of listeners) listener();
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
