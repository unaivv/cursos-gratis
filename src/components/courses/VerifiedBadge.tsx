import { freshnessTier } from "@/lib/courses/freshness";

const TIER_COLOR: Record<string, string> = {
  fresh: "text-[var(--fresh-green)]",
  aging: "text-stamp-gold",
  stale: "text-stamp-red",
};

/** The "verificado {date}" line, colored by how long ago that was —
 * a stale check says so instead of looking identical to a fresh one. */
export function VerifiedBadge({ date }: { date: string }) {
  const tier = freshnessTier(date);
  return (
    <span className={TIER_COLOR[tier]}>
      verificado {date}
      {tier === "stale" && " — pendiente de revisar"}
    </span>
  );
}
