/**
 * Dumps the grounded source data for AI summarization (step 1 of 2; the
 * import is scripts/import-ai-content.ts). Only YouTube courses that
 * have real enrichment data are exported — Udemy pages can't be
 * enriched, and a summary written from a title alone would be invented.
 *
 * Prefer scripts/ai-backfill.ts, which runs the whole review
 * automatically; this manual flow is for generating outside the repo.
 *
 * Run: DATABASE_URL=... npx tsx scripts/export-course-data.ts <out.json> [--all]
 * By default only rows without the editorial analysis yet; --all
 * re-exports everything.
 */
import { writeFileSync } from "node:fs";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { db } from "../src/lib/db/client";
import { categories, courses } from "../src/lib/db/schema";
import { buildReviewMessage, catalogFor, reviewInputFromRow } from "./ai-review";

async function main() {
  const out = process.argv[2];
  if (!out) throw new Error("usage: export-course-data.ts <out.json> [--all]");
  const all = process.argv.includes("--all");

  const categoryNames = new Map((await db.select().from(categories)).map((c) => [c.slug, c.name]));
  const published = await db.select().from(courses).where(eq(courses.status, "published"));
  const rows = await db
    .select()
    .from(courses)
    .where(
      and(
        eq(courses.status, "published"),
        eq(courses.platform, "youtube"),
        isNotNull(courses.enrichedAt),
        all ? undefined : isNull(courses.aiAnalyzedAt)
      )
    );

  // Same input the automated review sees (scripts/ai-review.ts), so a
  // manual generation can follow REVIEW_SYSTEM_PROMPT verbatim. Untrusted
  // third-party text (description, chapters) stays inside `message`'s
  // data markers.
  const data = rows.map((row) => {
    const input = reviewInputFromRow(
      row,
      categoryNames.get(row.category) ?? row.category,
      catalogFor(row.category, published, row.slug)
    );
    return { id: row.id, slug: row.slug, message: buildReviewMessage(input) };
  });
  writeFileSync(out, JSON.stringify(data, null, 1));
  console.log(`Exported ${data.length} course(s) to ${out}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => process.exit(process.exitCode ?? 0));
