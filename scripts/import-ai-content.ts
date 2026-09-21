/**
 * Imports AI-written course content (step 2 of 2; the export is
 * scripts/export-course-data.ts). Every object is validated against
 * aiContentSchema and matched to an existing YouTube course by id —
 * anything invalid or unknown is reported and skipped, never written.
 *
 * Run: DATABASE_URL=... npx tsx scripts/import-ai-content.ts out-1.json [out-2.json ...]
 */
import { readFileSync } from "node:fs";
import { and, eq } from "drizzle-orm";
import { db } from "../src/lib/db/client";
import { courses } from "../src/lib/db/schema";
import { aiContentSchema } from "../src/lib/courses/ai-content";

async function main() {
  const files = process.argv.slice(2);
  if (files.length === 0) throw new Error("usage: import-ai-content.ts <out.json> [...]");

  let written = 0;
  const problems: string[] = [];
  const seen = new Set<string>();

  for (const file of files) {
    const items: unknown[] = JSON.parse(readFileSync(file, "utf-8"));
    for (const item of items) {
      const parsed = aiContentSchema.safeParse(item);
      if (!parsed.success) {
        const id = (item as { id?: string })?.id ?? "?";
        problems.push(`${id}: ${parsed.error.issues.map((i) => `${i.path.join(".")} ${i.message}`).join("; ")}`);
        continue;
      }
      const { id, summary, overview, highlights, level } = parsed.data;
      if (seen.has(id)) {
        problems.push(`${id}: duplicate id across files`);
        continue;
      }
      seen.add(id);

      const updated = await db
        .update(courses)
        .set({
          aiSummary: summary,
          aiOverview: overview,
          aiHighlights: highlights,
          aiLevel: level,
          aiGeneratedAt: new Date(),
        })
        .where(and(eq(courses.id, id), eq(courses.platform, "youtube")))
        .returning({ id: courses.id });
      if (updated.length === 0) problems.push(`${id}: no matching YouTube course`);
      else written++;
    }
  }

  console.log(`Wrote AI content for ${written} course(s).`);
  if (problems.length > 0) {
    console.error(`${problems.length} problem(s):\n${problems.join("\n")}`);
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => process.exit(process.exitCode ?? 0));
