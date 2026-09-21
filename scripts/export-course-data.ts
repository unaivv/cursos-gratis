/**
 * Dumps the grounded source data for AI summarization (step 1 of 2; the
 * import is scripts/import-ai-content.ts). Only YouTube courses that
 * have real enrichment data are exported — Udemy pages can't be
 * enriched, and a summary written from a title alone would be invented.
 *
 * Run: DATABASE_URL=... npx tsx scripts/export-course-data.ts <out.json> [--all]
 * By default only rows without AI content yet; --all re-exports everything.
 */
import { writeFileSync } from "node:fs";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { db } from "../src/lib/db/client";
import { categories, courses } from "../src/lib/db/schema";

const URL_PATTERN = /https?:\/\/\S+/g;

async function main() {
  const out = process.argv[2];
  if (!out) throw new Error("usage: export-course-data.ts <out.json> [--all]");
  const all = process.argv.includes("--all");

  const categoryNames = new Map((await db.select().from(categories)).map((c) => [c.slug, c.name]));
  const rows = await db
    .select()
    .from(courses)
    .where(
      and(
        eq(courses.status, "published"),
        eq(courses.platform, "youtube"),
        isNotNull(courses.enrichedAt),
        all ? undefined : isNull(courses.aiGeneratedAt)
      )
    );

  const data = rows.map((row) => ({
    id: row.id,
    title: row.title,
    author: row.author,
    category: categoryNames.get(row.category) ?? row.category,
    kind: row.youtubePlaylistId ? "lista de reproducción" : "vídeo",
    durationMinutes: row.durationSeconds ? Math.round(row.durationSeconds / 60) : null,
    lessonCount: row.lessonCount,
    publishedYear: row.publishedAt ? row.publishedAt.slice(0, 4) : null,
    // Untrusted text written by third parties — the prompt treats it as data.
    chapters: (row.chapters ?? []).slice(0, 40).map((c) => c.title),
    description: (row.description ?? "").replace(URL_PATTERN, "").replace(/\s+/g, " ").trim().slice(0, 1200),
  }));
  writeFileSync(out, JSON.stringify(data, null, 1));
  console.log(`Exported ${data.length} course(s) to ${out}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => process.exit(process.exitCode ?? 0));
