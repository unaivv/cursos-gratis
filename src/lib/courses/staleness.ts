import { UDEMY_REVERIFY_DAYS } from "@/lib/config";

/**
 * Spec: content-ingestion — "Stale Udemy record flagged". Only Udemy
 * courses need this (no API to auto-refresh `lastVerifiedAt`); YouTube
 * records get relatively fresh dates from the sync job.
 */
export function isStaleUdemy(
  course: { platform: string; lastVerifiedAt: string },
  now: Date = new Date()
): boolean {
  if (course.platform !== "udemy") return false;
  const verified = new Date(course.lastVerifiedAt).getTime();
  const staleAfter = now.getTime() - UDEMY_REVERIFY_DAYS * 24 * 60 * 60 * 1000;
  return verified < staleAfter;
}
