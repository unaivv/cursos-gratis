/**
 * YouTube enrichment job. Fills the optional per-course columns
 * (duration, lesson count, syllabus/chapters, description, publish date)
 * from the YouTube Data API so each course page has real, course-specific
 * content instead of a one-line template.
 *
 * Cost: `videos.list`, `playlists.list` and `playlistItems.list` are
 * 1 quota unit per call (videos batched 50 per call) — a few units per
 * run, negligible next to the 10,000/day bucket. Never uses `search.list`.
 *
 * Only rows with `enriched_at IS NULL` are processed, unless `--force`
 * is passed (re-fetch everything, e.g. after changing the parsing).
 * Also called at the end of scripts/sync-youtube.ts.
 *
 * Run: DATABASE_URL=... YOUTUBE_API_KEY=... npx tsx scripts/enrich-youtube.ts [--force]
 */
import { fileURLToPath } from "node:url";
import { and, eq, isNotNull, isNull, or } from "drizzle-orm";
import { db } from "../src/lib/db/client";
import { courses as coursesTable } from "../src/lib/db/schema";
import { parseChapters, parseIsoDuration, type Chapter } from "../src/lib/courses/youtube-meta";
import { callYoutubeApi, QuotaExceededError } from "./youtube-api";

const MAX_DESCRIPTION_LENGTH = 2000;
const BATCH_SIZE = 50;

export type VideoItem = {
  id: string;
  snippet: { description?: string; publishedAt?: string };
  contentDetails: { duration: string };
};
type PlaylistItem = {
  id: string;
  snippet: { description?: string; publishedAt?: string };
  contentDetails: { itemCount: number };
};
type PlaylistEntry = { snippet: { title: string }; contentDetails: { videoId: string } };

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

const day = (iso?: string) => (iso ? iso.slice(0, 10) : null);

/** The enrichment columns for one video — shared with the intake review. */
export function videoEnrichmentFields(video: VideoItem) {
  const description = video.snippet.description ?? "";
  const chapters = parseChapters(description);
  return {
    description: description.slice(0, MAX_DESCRIPTION_LENGTH) || null,
    durationSeconds: parseIsoDuration(video.contentDetails.duration),
    lessonCount: chapters.length > 0 ? chapters.length : null,
    chapters: chapters.length > 0 ? chapters : null,
    publishedAt: day(video.snippet.publishedAt),
    enrichedAt: new Date(),
  };
}

export async function fetchVideos(ids: string[], apiKey: string): Promise<Map<string, VideoItem>> {
  const byId = new Map<string, VideoItem>();
  for (const batch of chunk(ids, BATCH_SIZE)) {
    const data = await callYoutubeApi<{ items: VideoItem[] }>(
      "videos",
      { part: "snippet,contentDetails", id: batch.join(","), maxResults: String(BATCH_SIZE) },
      apiKey
    );
    for (const item of data.items) byId.set(item.id, item);
  }
  return byId;
}

async function enrichVideoCourses(
  rows: { id: string; youtubeVideoId: string | null }[],
  apiKey: string
): Promise<number> {
  const ids = rows.map((r) => r.youtubeVideoId).filter((id): id is string => Boolean(id));
  const videos = await fetchVideos(ids, apiKey);
  let updated = 0;
  for (const row of rows) {
    const video = row.youtubeVideoId ? videos.get(row.youtubeVideoId) : undefined;
    if (!video) {
      console.warn(`Video ${row.youtubeVideoId} not returned by the API (private/deleted?) — skipped.`);
      continue;
    }
    await db
      .update(coursesTable)
      .set(videoEnrichmentFields(video))
      .where(eq(coursesTable.id, row.id));
    updated++;
  }
  return updated;
}

async function enrichPlaylistCourse(
  row: { id: string; youtubePlaylistId: string | null },
  apiKey: string
): Promise<boolean> {
  const playlistId = row.youtubePlaylistId;
  if (!playlistId) return false;

  const playlists = await callYoutubeApi<{ items: PlaylistItem[] }>(
    "playlists",
    { part: "snippet,contentDetails", id: playlistId },
    apiKey
  );
  const playlist = playlists.items[0];
  if (!playlist) {
    console.warn(`Playlist ${playlistId} not returned by the API — skipped.`);
    return false;
  }

  // Lesson titles (first page only — a 50-lesson syllabus is plenty).
  const entries = await callYoutubeApi<{ items: PlaylistEntry[] }>(
    "playlistItems",
    { part: "snippet,contentDetails", playlistId, maxResults: String(BATCH_SIZE) },
    apiKey
  );
  const lessons = entries.items.filter(
    (e) => e.snippet.title !== "Private video" && e.snippet.title !== "Deleted video"
  );
  const chapters: Chapter[] = lessons.map((e) => ({ title: e.snippet.title.slice(0, 120) }));

  // Total duration only when we saw every lesson — a partial sum would be a lie.
  let durationSeconds: number | null = null;
  const itemCount = playlist.contentDetails.itemCount;
  if (itemCount > 0 && itemCount <= BATCH_SIZE && lessons.length === itemCount) {
    const videos = await fetchVideos(lessons.map((e) => e.contentDetails.videoId), apiKey);
    const durations = lessons.map((e) => {
      const video = videos.get(e.contentDetails.videoId);
      return video ? parseIsoDuration(video.contentDetails.duration) : null;
    });
    if (durations.every((d): d is number => d !== null)) {
      durationSeconds = durations.reduce((sum, d) => sum + d, 0);
    }
  }

  await db
    .update(coursesTable)
    .set({
      description: (playlist.snippet.description ?? "").slice(0, MAX_DESCRIPTION_LENGTH) || null,
      durationSeconds,
      lessonCount: itemCount > 0 ? itemCount : null,
      chapters: chapters.length > 0 ? chapters : null,
      publishedAt: day(playlist.snippet.publishedAt),
      enrichedAt: new Date(),
    })
    .where(eq(coursesTable.id, row.id));
  return true;
}

export async function enrichYoutubeCourses(apiKey: string, options: { force?: boolean } = {}) {
  const pendingEnrichment = options.force ? undefined : isNull(coursesTable.enrichedAt);
  const rows = await db
    .select({
      id: coursesTable.id,
      youtubeVideoId: coursesTable.youtubeVideoId,
      youtubePlaylistId: coursesTable.youtubePlaylistId,
    })
    .from(coursesTable)
    .where(
      and(
        eq(coursesTable.platform, "youtube"),
        or(isNotNull(coursesTable.youtubeVideoId), isNotNull(coursesTable.youtubePlaylistId)),
        pendingEnrichment
      )
    );

  const videoRows = rows.filter((r) => r.youtubeVideoId);
  const playlistRows = rows.filter((r) => !r.youtubeVideoId && r.youtubePlaylistId);

  try {
    const videos = await enrichVideoCourses(videoRows, apiKey);
    let playlists = 0;
    for (const row of playlistRows) {
      if (await enrichPlaylistCourse(row, apiKey)) playlists++;
    }
    console.log(`Enriched ${videos} video course(s) and ${playlists} playlist course(s).`);
  } catch (error) {
    if (error instanceof QuotaExceededError) {
      console.error(`Stopping enrichment early — ${error.message}`);
      return;
    }
    throw error;
  }
}

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error("YOUTUBE_API_KEY is required");
    process.exit(1);
  }
  // Same reason as sync-youtube.ts: the postgres.js pool keeps the
  // process alive after an error unless we force-exit.
  enrichYoutubeCourses(apiKey, { force: process.argv.includes("--force") })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(() => process.exit(process.exitCode ?? 0));
}
