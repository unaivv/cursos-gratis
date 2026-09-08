/**
 * YouTube ingestion job (spec: content-ingestion — Requirement: YouTube
 * sync writes pending records, review moves to the admin panel).
 *
 * Pulls the uploads playlist of every channel listed in
 * `content/sources/youtube-channels.json` via `channels.list` +
 * `playlistItems.list` (the general 10,000-unit/day quota bucket), never
 * `search.list` (separate ~100-call/day bucket). Upserts one DB row per
 * video (by `slug`, which embeds the video ID — see buildCourseSlug), as
 * `status: "pending"`: a human publishes it from the admin panel, not
 * this job.
 *
 * Run: DATABASE_URL=... YOUTUBE_API_KEY=... npx tsx scripts/sync-youtube.ts
 * Trigger: .github/workflows/sync-youtube.yml (weekly) AND a raspi cron
 * (see scripts/README.md) — either is enough on its own; running both is
 * harmless since this job is idempotent.
 *
 * Optionally emails a digest of newly-discovered (not previously seen)
 * videos to ADMIN_EMAIL via Resend (RESEND_API_KEY/RESEND_FROM_EMAIL) —
 * skipped silently if those aren't set. Never emails when nothing new
 * was found.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { eq, sql } from "drizzle-orm";
import { db } from "../src/lib/db/client";
import { escapeHtml, sendAdminNotification } from "../src/lib/email/send";
import { courses as coursesTable, type NewCourseRow } from "../src/lib/db/schema";
import { toCourseRecord } from "../src/lib/courses/read";
import { courseRecordSchema, type CourseRecord } from "../src/lib/courses/schema";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const SOURCES_PATH = path.join(CONTENT_ROOT, "sources", "youtube-channels.json");
const API_BASE = "https://www.googleapis.com/youtube/v3";

export type CuratedSource = {
  channelId: string;
  channelName: string;
  category: string;
};

export type YoutubeVideoSummary = {
  videoId: string;
  title: string;
};

/** Turns a video title into a stable, kebab-case slug for the record's filename/URL. */
export function buildCourseSlug(title: string, videoId: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
  return base ? `${base}-${videoId.toLowerCase()}` : videoId.toLowerCase();
}

export function mapVideoToCourseRecord(
  video: YoutubeVideoSummary,
  source: CuratedSource,
  verifiedAt: string
): CourseRecord {
  return courseRecordSchema.parse({
    slug: buildCourseSlug(video.title, video.videoId),
    title: video.title,
    platform: "youtube",
    category: source.category,
    sourceUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
    freeStatus: "free",
    lastVerifiedAt: verifiedAt,
    youtube: { videoId: video.videoId, channelId: source.channelId },
  });
}

/**
 * Merges freshly-synced records into the already-stored ones, matching by
 * `youtube.videoId`. A video already stored is updated in place (never
 * duplicated) — spec: Ingestion pipeline is idempotent. Crucially, an
 * existing record's `status` is PRESERVED (a re-sync must never silently
 * un-publish a course an admin already reviewed) — everything else
 * (title, lastVerifiedAt) is refreshed from the new sync.
 */
export function dedupeByVideoId(
  existing: CourseRecord[],
  incoming: CourseRecord[]
): CourseRecord[] {
  // This job only ever produces single-video records (mapVideoToCourseRecord
  // always sets videoId, never playlistId) — playlist-shaped courses are
  // added by hand, not through this sync job.
  const existingByVideoId = new Map<string, CourseRecord>();
  for (const record of existing) {
    if (record.youtube?.videoId) existingByVideoId.set(record.youtube.videoId, record);
  }

  const byVideoId = new Map<string, CourseRecord>(existingByVideoId);
  for (const record of incoming) {
    if (!record.youtube?.videoId) continue;
    const previous = existingByVideoId.get(record.youtube.videoId);
    byVideoId.set(record.youtube.videoId, previous ? { ...record, status: previous.status } : record);
  }
  return [...byVideoId.values()];
}

async function readExistingYoutubeCourses(): Promise<CourseRecord[]> {
  const rows = await db.select().from(coursesTable).where(eq(coursesTable.platform, "youtube"));
  return rows.map(toCourseRecord);
}

/** Thrown when the YouTube API reports quota exhaustion (403 quotaExceeded). */
export class QuotaExceededError extends Error {}

async function callYoutubeApi<T>(
  endpoint: string,
  params: Record<string, string>,
  apiKey: string
): Promise<T> {
  const url = new URL(`${API_BASE}/${endpoint}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url);
  if (response.status === 403) {
    const body = await response.text();
    if (body.includes("quotaExceeded")) {
      throw new QuotaExceededError(`YouTube API quota exceeded calling ${endpoint}`);
    }
  }
  if (!response.ok) {
    throw new Error(`YouTube API ${endpoint} failed: ${response.status} ${await response.text()}`);
  }
  return (await response.json()) as T;
}

async function fetchUploadsPlaylistId(channelId: string, apiKey: string): Promise<string> {
  const data = await callYoutubeApi<{
    items: { contentDetails: { relatedPlaylists: { uploads: string } } }[];
  }>("channels", { part: "contentDetails", id: channelId }, apiKey);
  const uploads = data.items[0]?.contentDetails.relatedPlaylists.uploads;
  if (!uploads) throw new Error(`No uploads playlist found for channel ${channelId}`);
  return uploads;
}

async function fetchPlaylistVideos(
  playlistId: string,
  apiKey: string,
  maxResults = 25
): Promise<YoutubeVideoSummary[]> {
  const data = await callYoutubeApi<{
    items: { contentDetails: { videoId: string }; snippet: { title: string } }[];
  }>(
    "playlistItems",
    { part: "snippet,contentDetails", playlistId, maxResults: String(maxResults) },
    apiKey
  );
  return data.items.map((item) => ({
    videoId: item.contentDetails.videoId,
    title: item.snippet.title,
  }));
}

async function main() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error("YOUTUBE_API_KEY is required");
    process.exitCode = 1;
    return;
  }

  const sources: CuratedSource[] = JSON.parse(readFileSync(SOURCES_PATH, "utf-8"));
  const existing = await readExistingYoutubeCourses();
  const verifiedAt = new Date().toISOString().slice(0, 10);
  const incoming: CourseRecord[] = [];

  for (const source of sources) {
    try {
      const uploadsPlaylistId = await fetchUploadsPlaylistId(source.channelId, apiKey);
      const videos = await fetchPlaylistVideos(uploadsPlaylistId, apiKey);
      for (const video of videos) {
        incoming.push(mapVideoToCourseRecord(video, source, verifiedAt));
      }
    } catch (error) {
      if (error instanceof QuotaExceededError) {
        console.error(`Stopping sync early — ${error.message}`);
        break;
      }
      throw error;
    }
  }

  const existingVideoIds = new Set(existing.map((r) => r.youtube?.videoId).filter(Boolean));
  const newlyDiscovered = incoming.filter(
    (r) => r.youtube?.videoId && !existingVideoIds.has(r.youtube.videoId)
  );

  const merged = dedupeByVideoId(existing, incoming);
  for (const record of merged) {
    const row: NewCourseRow = {
      slug: record.slug,
      title: record.title,
      platform: record.platform,
      category: record.category,
      sourceUrl: record.sourceUrl,
      freeStatus: record.freeStatus,
      status: record.status,
      lastVerifiedAt: record.lastVerifiedAt,
      youtubeVideoId: record.youtube?.videoId ?? null,
      youtubeChannelId: record.youtube?.channelId ?? null,
    };
    await db
      .insert(coursesTable)
      .values(row)
      .onConflictDoUpdate({
        target: coursesTable.slug,
        set: {
          title: sql`excluded.title`,
          category: sql`excluded.category`,
          lastVerifiedAt: sql`excluded.last_verified_at`,
          status: sql`excluded.status`,
          updatedAt: sql`now()`,
        },
      });
  }
  console.log(`Synced ${merged.length} YouTube course records from ${sources.length} curated sources.`);
  console.log(`${newlyDiscovered.length} new video(s) this run.`);

  if (newlyDiscovered.length > 0) {
    const itemsHtml = newlyDiscovered
      .map(
        (r) =>
          `<li><a href="${escapeHtml(r.sourceUrl)}">${escapeHtml(r.title)}</a> — ${escapeHtml(r.category)}</li>`
      )
      .join("");
    await sendAdminNotification(
      `${newlyDiscovered.length} curso(s) nuevo(s) de YouTube — pendientes de revisión`,
      `
        <p>El sync semanal de YouTube encontró ${newlyDiscovered.length} vídeo(s) nuevo(s),
        guardados como <strong>pendiente</strong> — no se ven en el sitio hasta que los publiques
        desde <a href="https://cursos.unaividal.com/admin">/admin</a>.</p>
        <ul>${itemsHtml}</ul>
      `
    );
  }
}

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
