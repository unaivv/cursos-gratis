/**
 * One-off: migrates every committed course JSON file under
 * `content/courses/{youtube,udemy}/*.json` into the `courses` table,
 * as `status: "published"` (these were already git/PR-reviewed and live
 * on the site before this change — see design.md Migration/Rollout).
 * Idempotent — safe to re-run (upserts by slug).
 *
 * Run: DATABASE_URL=... npx tsx scripts/migrate-courses.ts
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "../src/lib/db/client";
import { courses, type NewCourseRow } from "../src/lib/db/schema";
import { courseRecordSchema } from "../src/lib/courses/schema";
import { sql } from "drizzle-orm";

const PLATFORMS = ["youtube", "udemy"] as const;

function listJsonFiles(dir: string): string[] {
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => path.join(dir, f));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function main() {
  const contentRoot = path.join(process.cwd(), "content", "courses");
  let migrated = 0;

  for (const platform of PLATFORMS) {
    for (const file of listJsonFiles(path.join(contentRoot, platform))) {
      const record = courseRecordSchema.parse(JSON.parse(readFileSync(file, "utf-8")));

      const row: NewCourseRow = {
        slug: record.slug,
        title: record.title,
        platform: record.platform,
        category: record.category,
        sourceUrl: record.sourceUrl,
        freeStatus: record.freeStatus,
        status: "published",
        lastVerifiedAt: record.lastVerifiedAt,
        youtubeVideoId: record.youtube?.videoId ?? null,
        youtubeChannelId: record.youtube?.channelId ?? null,
      };

      await db
        .insert(courses)
        .values(row)
        .onConflictDoUpdate({
          target: courses.slug,
          set: {
            title: sql`excluded.title`,
            category: sql`excluded.category`,
            sourceUrl: sql`excluded.source_url`,
            lastVerifiedAt: sql`excluded.last_verified_at`,
            youtubeVideoId: sql`excluded.youtube_video_id`,
            youtubeChannelId: sql`excluded.youtube_channel_id`,
            updatedAt: sql`now()`,
          },
        });
      migrated += 1;
    }
  }

  console.log(`Migrated ${migrated} course record(s) as published.`);
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
