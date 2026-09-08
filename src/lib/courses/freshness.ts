/**
 * How stale a "verificado {date}" stamp is, for the traffic-light coloring
 * the audit asked for: a same-day/recent check reads as trustworthy, an
 * old one should visibly ask for re-verification instead of silently
 * looking identical to a fresh one.
 */
export type FreshnessTier = "fresh" | "aging" | "stale";

const DAY_MS = 24 * 60 * 60 * 1000;

export function daysSinceVerified(lastVerifiedAt: string, today: Date = new Date()): number {
  const verified = new Date(`${lastVerifiedAt}T00:00:00Z`);
  const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  return Math.floor((todayUtc.getTime() - verified.getTime()) / DAY_MS);
}

export function freshnessTier(lastVerifiedAt: string, today: Date = new Date()): FreshnessTier {
  const days = daysSinceVerified(lastVerifiedAt, today);
  if (days <= 7) return "fresh";
  if (days <= 30) return "aging";
  return "stale";
}
