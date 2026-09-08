import { sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { searchQueries } from "@/lib/db/schema";

// Fallback for a cold start (no search history yet) — genuinely common
// subjects in the catalog, not placeholder text.
const FALLBACK_SEARCHES = ["Python", "Figma", "Excel"];

/** Logs a search that actually found something — fire-and-forget, never
 * throws (a logging hiccup must not break the search page). Queries with
 * zero results are skipped so they can't poison the popular-searches
 * list with dead ends. */
export async function logSearchQuery(query: string): Promise<void> {
  const trimmed = query.trim();
  if (!trimmed) return;
  try {
    await db.insert(searchQueries).values({ query: trimmed });
  } catch (err) {
    console.error("[popular-searches] log failed:", err);
  }
}

/**
 * The N most-searched terms in the last 30 days — "peticiones populares"
 * on the home page. Groups case/whitespace-insensitively so "python",
 * "Python " and "PYTHON" count as one, displayed using the most recent
 * original casing. Falls back to a fixed list until there's enough real
 * search history.
 */
export async function getPopularSearches(limit: number): Promise<string[]> {
  let ranked: string[] = [];
  try {
    const rows = await db.execute<{ query: string; freq: number }>(sql`
      select (array_agg(query order by created_at desc))[1] as query,
             count(*)::int as freq
      from ${searchQueries}
      where created_at > now() - interval '30 days'
      group by lower(trim(query))
      order by freq desc, max(created_at) desc
      limit ${limit}
    `);
    ranked = (rows as unknown as { query: string; freq: number }[]).map((r) => r.query.trim());
  } catch (err) {
    console.error("[popular-searches] query failed:", err);
  }

  if (ranked.length >= limit) return ranked.slice(0, limit);

  // Not enough real data yet — pad with fallbacks, skipping duplicates.
  const seen = new Set(ranked.map((r) => r.toLowerCase()));
  for (const fallback of FALLBACK_SEARCHES) {
    if (ranked.length >= limit) break;
    if (!seen.has(fallback.toLowerCase())) ranked.push(fallback);
  }
  return ranked;
}
