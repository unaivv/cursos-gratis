/**
 * One-off curation: moves the courses listed in a JSON file back to
 * `status: "pending"` (never deletes — reversible from /admin). Only rows
 * that are currently `published` and whose slug is in the list change.
 *
 * Run: npm run curate [-- --apply] [-- --file path/to/list.json]
 *   (default)  dry run: prints what would change, writes nothing
 *   --apply    actually unpublish
 *   --file F   list to apply (default DEFAULT_LIST_FILE)
 *
 * The list is an array of {slug, reason, title}; see scripts/curation/.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { z } from "zod";

export const DEFAULT_LIST_FILE = "scripts/curation/2026-10-12-unpublish.json";

const entrySchema = z.object({
  slug: z.string().trim().min(1),
  reason: z.string().trim().min(1),
  title: z.string().trim().min(1),
});
export type CurationEntry = z.infer<typeof entrySchema>;

/** Validates the parsed list file; throws with every problem found. */
export function parseCurationList(raw: unknown): CurationEntry[] {
  const parsed = z.array(entrySchema).min(1).safeParse(raw);
  if (!parsed.success) {
    throw new Error(`invalid curation list:\n${z.prettifyError(parsed.error)}`);
  }
  const seen = new Set<string>();
  const duplicates = parsed.data.filter((e) => seen.size === seen.add(e.slug).size).map((e) => e.slug);
  if (duplicates.length > 0) throw new Error(`duplicate slug(s) in curation list: ${duplicates.join(", ")}`);
  return parsed.data;
}

export type CurateOptions = { apply: boolean; file: string };

export function parseArgs(argv: string[]): CurateOptions {
  const options: CurateOptions = { apply: false, file: DEFAULT_LIST_FILE };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--apply") options.apply = true;
    else if (arg === "--dry-run") options.apply = false;
    else if (arg === "--file") {
      const next = argv[++i];
      if (next === undefined) throw new Error("--file needs a value");
      options.file = next;
    } else throw new Error(`unknown option: ${arg}`);
  }
  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const entries = parseCurationList(JSON.parse(await readFile(options.file, "utf8")));

  // Imported lazily so the pure helpers above can be tested without a DB.
  const { and, eq, inArray } = await import("drizzle-orm");
  const { db } = await import("../src/lib/db/client");
  const { courses } = await import("../src/lib/db/schema");

  const slugs = entries.map((e) => e.slug);
  const published = await db
    .select({ id: courses.id, slug: courses.slug })
    .from(courses)
    .where(and(inArray(courses.slug, slugs), eq(courses.status, "published")));
  const publishedSlugs = new Set(published.map((r) => r.slug));

  console.log(`${options.apply ? "APPLY" : "DRY RUN"} — ${options.file}: ${entries.length} listed, ${published.length} published.`);
  for (const entry of entries) {
    const mark = publishedSlugs.has(entry.slug) ? "→ pending" : "  skip (not published / not found)";
    console.log(`${mark}  [${entry.reason}] ${entry.slug} — ${entry.title}`);
  }

  if (!options.apply) {
    console.log("\nNothing written. Re-run with `npm run curate -- --apply` to unpublish.");
    return;
  }
  if (published.length === 0) return;
  const updated = await db
    .update(courses)
    .set({ status: "pending", updatedAt: new Date() })
    .where(and(inArray(courses.id, published.map((r) => r.id)), eq(courses.status, "published")))
    .returning({ slug: courses.slug });
  console.log(`\n${updated.length} course(s) moved back to pending.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // The postgres.js connection keeps the process alive; force the exit.
  main()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(() => process.exit(process.exitCode ?? 0));
}
