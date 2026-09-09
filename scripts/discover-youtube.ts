/**
 * Broader YouTube discovery — complements sync-youtube.ts (which only
 * ever looks at the fixed curated-channel list). This runs a handful of
 * category-tagged searches so genuinely useful courses from channels we
 * haven't curated (or don't even know about) can surface too, instead of
 * being permanently invisible to the sync.
 *
 * Deliberately NOT `search.list` on every run of sync-youtube.ts: that
 * endpoint costs 100 quota units/call vs. ~1 for channels.list/
 * playlistItems.list, so it's kept to its own small, fixed term list
 * (content/sources/youtube-search-terms.json) — one call per term, ~12
 * terms today, well under the 10,000-unit daily budget even run weekly.
 *
 * `videoDuration: long` (>20 min) is the only quality filter — it biases
 * toward "actually a course" over a 3-minute clip, nothing more. Search
 * results are noisier than a curated channel by nature, so — same as
 * sync-youtube.ts — everything lands as `status: "pending"`: a human
 * still decides what's worth publishing from /admin. This is a
 * discovery net, not an auto-publish pipeline.
 *
 * Run: DATABASE_URL=... YOUTUBE_API_KEY=... npx tsx scripts/discover-youtube.ts
 * Trigger: raspi cron, after sync-youtube.ts — see scripts/README.md.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sql } from "drizzle-orm";
import { db } from "../src/lib/db/client";
import { courses as coursesTable, type NewCourseRow } from "../src/lib/db/schema";
import { toCourseRecord } from "../src/lib/courses/read";
import { courseRecordSchema, type CourseRecord } from "../src/lib/courses/schema";
import { escapeHtml, sendAdminNotification } from "../src/lib/email/send";
import { buildCourseSlug, QuotaExceededError } from "./sync-youtube";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const TERMS_PATH = path.join(CONTENT_ROOT, "sources", "youtube-search-terms.json");
const API_BASE = "https://www.googleapis.com/youtube/v3";

export type SearchTerm = { query: string; category: string };

type SearchResultItem = {
  id: { videoId: string };
  snippet: { title: string; channelId: string; channelTitle: string };
};

async function searchVideos(term: string, apiKey: string): Promise<SearchResultItem[]> {
  const url = new URL(`${API_BASE}/search`);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("q", term);
  url.searchParams.set("type", "video");
  url.searchParams.set("videoDuration", "long"); // >20 min — "a course", not a clip
  url.searchParams.set("maxResults", "5");
  url.searchParams.set("key", apiKey);

  const response = await fetch(url);
  if (response.status === 403) {
    const body = await response.text();
    if (body.includes("quotaExceeded")) throw new QuotaExceededError(`quota exceeded searching "${term}"`);
  }
  if (!response.ok) {
    throw new Error(`YouTube search failed for "${term}": ${response.status} ${await response.text()}`);
  }
  const data = (await response.json()) as { items: SearchResultItem[] };
  return data.items ?? [];
}

function mapResultToCourseRecord(
  item: SearchResultItem,
  category: string,
  verifiedAt: string
): CourseRecord {
  return courseRecordSchema.parse({
    slug: buildCourseSlug(item.snippet.title, item.id.videoId),
    title: item.snippet.title,
    author: item.snippet.channelTitle,
    platform: "youtube",
    category,
    sourceUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    freeStatus: "free",
    lastVerifiedAt: verifiedAt,
    youtube: { videoId: item.id.videoId, channelId: item.snippet.channelId },
  });
}

async function main() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error("YOUTUBE_API_KEY is required");
    process.exitCode = 1;
    return;
  }

  const terms: SearchTerm[] = JSON.parse(readFileSync(TERMS_PATH, "utf-8"));
  const existingRows = await db.select().from(coursesTable);
  const existingVideoIds = new Set(
    existingRows.map(toCourseRecord).map((r) => r.youtube?.videoId).filter(Boolean)
  );

  const verifiedAt = new Date().toISOString().slice(0, 10);
  const discovered: CourseRecord[] = [];
  const seenThisRun = new Set<string>();

  for (const { query, category } of terms) {
    try {
      const items = await searchVideos(query, apiKey);
      for (const item of items) {
        if (existingVideoIds.has(item.id.videoId) || seenThisRun.has(item.id.videoId)) continue;
        seenThisRun.add(item.id.videoId);
        discovered.push(mapResultToCourseRecord(item, category, verifiedAt));
      }
    } catch (error) {
      if (error instanceof QuotaExceededError) {
        console.error(`Stopping discovery early — ${error.message}`);
        break;
      }
      throw error;
    }
  }

  for (const record of discovered) {
    const row: NewCourseRow = {
      slug: record.slug,
      title: record.title,
      author: record.author ?? null,
      platform: record.platform,
      category: record.category,
      sourceUrl: record.sourceUrl,
      freeStatus: record.freeStatus,
      status: "pending",
      lastVerifiedAt: record.lastVerifiedAt,
      youtubeVideoId: record.youtube?.videoId ?? null,
      youtubeChannelId: record.youtube?.channelId ?? null,
    };
    await db
      .insert(coursesTable)
      .values(row)
      .onConflictDoUpdate({
        target: coursesTable.slug,
        set: { updatedAt: sql`now()` },
      });
  }

  console.log(`Discovery searched ${terms.length} term(s), found ${discovered.length} new video(s).`);

  if (discovered.length > 0) {
    const itemsHtml = discovered
      .map(
        (r) =>
          `<li><a href="${escapeHtml(r.sourceUrl)}">${escapeHtml(r.title)}</a> — ${escapeHtml(r.author ?? "")} · ${escapeHtml(r.category)}</li>`
      )
      .join("");
    await sendAdminNotification(
      `${discovered.length} curso(s) nuevo(s) descubiertos (búsqueda) — pendientes de revisión`,
      `
        <p>La búsqueda semanal (fuera de los canales curados) encontró ${discovered.length}
        vídeo(s) nuevo(s) que parecen cursos completos, guardados como <strong>pendiente</strong>.
        Revísalos con más cuidado que los de canales curados — la búsqueda es más ruidosa —
        desde <a href="https://cursos.unaividal.com/admin">/admin</a>.</p>
        <ul>${itemsHtml}</ul>
      `
    );
  }
}

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
  // The postgres.js connection stays open on an uncaught error —
  // process.exitCode alone doesn't force Node to exit while a handle is
  // still open, so the process (and any cron/CI runner waiting on it)
  // hangs indefinitely instead of failing fast. Force it.
  main()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(() => process.exit(process.exitCode ?? 0));
}
