/**
 * Backfill of the editorial analysis for courses already in the catalog.
 * Runs the same AI review as the weekly intake (scripts/ai-review.ts,
 * same backends: Claude Code on a subscription token, or the API) over
 * every published course that doesn't have a current analysis yet, and
 * writes the result course by course.
 *
 *   - Idempotent / resumable: a course whose analysis is already at
 *     ANALYSIS_VERSION is skipped (unless --force), and each result is
 *     written as soon as it arrives — an interrupted run just continues
 *     where it stopped next time.
 *   - Grounded: courses without enough source data (no chapters and no
 *     meaningful description — e.g. Udemy, which can't be enriched) are
 *     reported and skipped, never analyzed from a bare title.
 *   - Never unpublishes: if the review says a listed course isn't really
 *     a course, it is only reported for a human to decide.
 *
 * Run:
 *   DATABASE_URL=... CLAUDE_CODE_OAUTH_TOKEN=... npx tsx scripts/ai-backfill.ts [options]
 * Options:
 *   --force              re-analyze courses that already have a current analysis
 *   --limit N            process at most N courses this run (batching)
 *   --category SLUG      only this category
 *   --slug SLUG          only this course (repeatable)
 *   --include-pending    also analyze pending (not yet published) courses
 *   --dry-run            review but don't write; print the results as JSON
 *   --delay-ms N         pause between reviews (default 1500)
 */
import { fileURLToPath } from "node:url";
import { eq } from "drizzle-orm";
import { ANALYSIS_VERSION, parseAnalysis } from "../src/lib/courses/ai-analysis";
import { catalogFor, cleanDescription, createReviewer, reviewBackend, reviewInputFromRow, type ReviewDecision } from "./ai-review";

/** Consecutive failures after which the run stops (rate limit, expired token…). */
const MAX_CONSECUTIVE_FAILURES = 3;
const MIN_DESCRIPTION_CHARS = 80;
const MIN_CHAPTERS = 3;

export type BackfillOptions = {
  force: boolean;
  limit: number | null;
  category: string | null;
  slugs: string[];
  includePending: boolean;
  dryRun: boolean;
  delayMs: number;
};

export function parseArgs(argv: string[]): BackfillOptions {
  const options: BackfillOptions = {
    force: false,
    limit: null,
    category: null,
    slugs: [],
    includePending: false,
    dryRun: false,
    delayMs: 1500,
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const value = () => {
      const next = argv[++i];
      if (next === undefined) throw new Error(`${arg} needs a value`);
      return next;
    };
    if (arg === "--force") options.force = true;
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--include-pending") options.includePending = true;
    else if (arg === "--limit") options.limit = Math.max(1, Number.parseInt(value(), 10) || 1);
    else if (arg === "--category") options.category = value();
    else if (arg === "--slug") options.slugs.push(value());
    else if (arg === "--delay-ms") options.delayMs = Math.max(0, Number.parseInt(value(), 10) || 0);
    else throw new Error(`unknown option: ${arg}`);
  }
  return options;
}

type Candidate = {
  slug: string;
  status: "pending" | "published";
  category: string;
  description: string | null;
  chapters: { title: string; start?: number }[] | null;
  aiAnalysis: unknown;
};

/** Enough real source data to write an analysis without inventing it. */
export function hasGrounding(row: Pick<Candidate, "description" | "chapters">): boolean {
  return (row.chapters?.length ?? 0) >= MIN_CHAPTERS || cleanDescription(row.description).length >= MIN_DESCRIPTION_CHARS;
}

/**
 * Which rows this run reviews, and which it leaves out for lack of data.
 * Pure — unit tested in ai-backfill.test.ts.
 */
export function selectBackfillTargets<T extends Candidate>(rows: T[], options: BackfillOptions) {
  const inScope = rows
    .filter((row) => options.includePending || row.status === "published")
    .filter((row) => !options.category || row.category === options.category)
    .filter((row) => options.slugs.length === 0 || options.slugs.includes(row.slug));

  const pending = inScope.filter((row) => {
    if (options.force) return true;
    const current = parseAnalysis(row.aiAnalysis);
    return !current || current.version < ANALYSIS_VERSION;
  });

  const ungrounded = pending.filter((row) => !hasGrounding(row));
  const grounded = pending.filter((row) => hasGrounding(row));
  const targets = options.limit ? grounded.slice(0, options.limit) : grounded;
  return { targets, ungrounded, remaining: grounded.length - targets.length };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const options = parseArgs(process.argv.slice(2));
  // Imported here, not at the top: the pure helpers above are unit tested
  // without a database connection.
  const { db } = await import("../src/lib/db/client");
  const { categories, courses } = await import("../src/lib/db/schema");

  const backend = reviewBackend();
  if (!backend) {
    throw new Error(
      "No AI backend configured: set CLAUDE_CODE_OAUTH_TOKEN (Claude subscription via Claude Code), " +
        "ANTHROPIC_API_KEY, or AI_REVIEW_BACKEND=cli to use a Claude Code CLI that is already logged in."
    );
  }
  const review = await createReviewer(backend);
  console.log(`AI backend: ${backend}${options.dryRun ? " (dry run — nothing is written)" : ""}`);

  const categoryNames = new Map((await db.select().from(categories)).map((c) => [c.slug, c.name]));
  const rows = await db.select().from(courses);
  const published = rows.filter((row) => row.status === "published");
  const { targets, ungrounded, remaining } = selectBackfillTargets(rows, options);

  console.log(
    `${targets.length} course(s) to analyze this run` +
      (remaining > 0 ? `, ${remaining} more left for later runs (--limit)` : "") +
      (ungrounded.length > 0 ? `, ${ungrounded.length} skipped for lack of source data` : "")
  );

  const failures: string[] = [];
  const notCourses: string[] = [];
  const dryRunResults: unknown[] = [];
  let written = 0;
  let consecutiveFailures = 0;

  for (const [index, row] of targets.entries()) {
    const label = `[${index + 1}/${targets.length}] ${row.slug}`;
    let decision: ReviewDecision;
    try {
      decision = await review(
        reviewInputFromRow(row, categoryNames.get(row.category) ?? row.category, catalogFor(row.category, published, row.slug))
      );
      consecutiveFailures = 0;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(`${row.slug}: ${message}`);
      console.error(`${label} FAILED: ${message}`);
      if (++consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        console.error(`Stopping after ${MAX_CONSECUTIVE_FAILURES} consecutive failures — re-run later to resume.`);
        break;
      }
      continue;
    }

    if (!decision.isCourse) {
      notCourses.push(`${row.slug}: ${decision.reason}`);
      console.warn(`${label} flagged as not a course (left as is): ${decision.reason}`);
    } else if (options.dryRun) {
      dryRunResults.push({ slug: row.slug, ...decision.content });
      console.log(`${label} ok (score ${decision.content.analysis.verdict.score})`);
    } else {
      const now = new Date();
      await db
        .update(courses)
        .set({
          aiSummary: decision.content.summary,
          aiOverview: decision.content.overview,
          aiHighlights: decision.content.highlights,
          aiLevel: decision.content.level,
          aiGeneratedAt: now,
          aiAnalysis: decision.content.analysis,
          aiAnalyzedAt: now,
        })
        .where(eq(courses.id, row.id));
      written++;
      console.log(`${label} written (score ${decision.content.analysis.verdict.score})`);
    }
    if (options.delayMs > 0 && index < targets.length - 1) await sleep(options.delayMs);
  }

  if (options.dryRun) console.log(JSON.stringify(dryRunResults, null, 2));
  console.log(`\nDone: ${written} written, ${failures.length} failed, ${notCourses.length} flagged.`);
  if (ungrounded.length > 0) {
    console.log(
      `Without enough source data (add an editor note in /admin, or enrich them): ${ungrounded.map((r) => r.slug).join(", ")}`
    );
  }
  if (notCourses.length > 0) console.log(`Flagged as not a course — review in /admin:\n${notCourses.join("\n")}`);
  if (failures.length > 0) {
    console.error(`Failures (re-run to retry):\n${failures.join("\n")}`);
    process.exitCode = 1;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(() => process.exit(process.exitCode ?? 0));
}
