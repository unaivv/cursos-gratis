/**
 * One-off: seeds the `categories` table from `content/categories.json`.
 * Idempotent — safe to re-run (upserts by slug).
 *
 * Run: DATABASE_URL=... npx tsx scripts/seed-categories.ts
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "../src/lib/db/client";
import { categories } from "../src/lib/db/schema";
import { sql } from "drizzle-orm";

async function main() {
  const raw: { slug: string; name: string }[] = JSON.parse(
    readFileSync(path.join(process.cwd(), "content", "categories.json"), "utf-8")
  );

  for (const category of raw) {
    await db
      .insert(categories)
      .values(category)
      .onConflictDoUpdate({ target: categories.slug, set: { name: sql`excluded.name` } });
  }

  console.log(`Seeded ${raw.length} categories.`);
}

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
  main()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(() => process.exit());
}
