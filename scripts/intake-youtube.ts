/**
 * Intake pipeline for newly discovered YouTube videos (used by
 * sync-youtube.ts and discover-youtube.ts). Instead of dumping every new
 * video into the admin queue, each one is:
 *
 *   1. dropped if we already rejected it in an earlier run,
 *   2. looked up in the YouTube API (duration, chapters, description),
 *   3. rejected outright if it is too short to be a course,
 *   4. reviewed by Claude: is it a real course? if so, write the summary.
 *
 * Approved videos are inserted as `pending` WITH their AI summary, ready
 * to approve in /admin — nothing is ever auto-published. Rejected ones are
 * remembered in `rejected_videos` so they aren't re-reviewed every week.
 * Anything that failed to review (API error, refusal, missing video) is
 * skipped and simply retried on the next run.
 *
 * AI review needs ANTHROPIC_API_KEY. Without it the length prefilter still
 * runs and the rest fall back to the old behaviour (pending, no summary),
 * with a loud warning — an unconfigured key must not silently lose videos.
 */
import { inArray, sql } from "drizzle-orm";
import { db } from "../src/lib/db/client";
import { courses as coursesTable, rejectedVideos, type NewCourseRow } from "../src/lib/db/schema";
import { escapeHtml } from "../src/lib/email/send";
import type { CourseRecord } from "../src/lib/courses/schema";
import { parseChapters } from "../src/lib/courses/youtube-meta";
import { createReviewer, prefilterReason, type ReviewDecision, type ReviewInput } from "./ai-review";
import { fetchVideos, videoEnrichmentFields, type VideoItem } from "./enrich-youtube";

export type Reviewer = (input: ReviewInput) => Promise<ReviewDecision>;

export type Approved = {
  record: CourseRecord;
  video: VideoItem;
  /** Undefined when AI review wasn't configured. */
  decision?: Extract<ReviewDecision, { isCourse: true }>;
};
export type Rejected = { videoId: string; title: string; reason: string; source: "prefilter" | "ai" };
export type Skipped = { videoId: string; title: string; why: string };

export type IntakeResult = {
  approved: Approved[];
  rejected: Rejected[];
  skipped: Skipped[];
  aiConfigured: boolean;
};

/**
 * The decision logic, free of I/O so it can be unit tested. `reviewer` is
 * `"unconfigured"` (no API key), `"unavailable"` (SDK missing/failed to
 * load) or a function that reviews one video.
 */
export async function decideIntake(
  candidates: { record: CourseRecord; video: VideoItem | undefined }[],
  reviewer: Reviewer | "unconfigured" | "unavailable"
): Promise<IntakeResult> {
  const result: IntakeResult = {
    approved: [],
    rejected: [],
    skipped: [],
    aiConfigured: reviewer !== "unconfigured",
  };

  for (const { record, video } of candidates) {
    const videoId = record.youtube?.videoId;
    if (!videoId) continue;
    if (!video) {
      result.skipped.push({ videoId, title: record.title, why: "YouTube no devolvió el vídeo (¿privado o borrado?)" });
      continue;
    }

    const fields = videoEnrichmentFields(video);
    const tooShort = prefilterReason(fields.durationSeconds);
    if (tooShort) {
      result.rejected.push({ videoId, title: record.title, reason: tooShort, source: "prefilter" });
      continue;
    }

    if (reviewer === "unconfigured") {
      result.approved.push({ record, video });
      continue;
    }
    if (reviewer === "unavailable") {
      result.skipped.push({ videoId, title: record.title, why: "Revisión IA no disponible en esta ejecución" });
      continue;
    }

    try {
      const decision = await reviewer({
        title: record.title,
        author: record.author,
        category: record.category,
        kind: "vídeo",
        durationSeconds: fields.durationSeconds,
        publishedYear: fields.publishedAt ? fields.publishedAt.slice(0, 4) : null,
        chapters: parseChapters(video.snippet.description ?? "").map((c) => c.title),
        description: (video.snippet.description ?? "").replace(/https?:\/\/\S+/g, "").replace(/\s+/g, " ").trim(),
      });
      if (decision.isCourse) result.approved.push({ record, video, decision });
      else result.rejected.push({ videoId, title: record.title, reason: decision.reason, source: "ai" });
    } catch (error) {
      result.skipped.push({
        videoId,
        title: record.title,
        why: `Error en la revisión IA: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }
  return result;
}

/** Full pipeline: filter, fetch, review, persist. */
export async function intakeNewVideos(records: CourseRecord[], youtubeApiKey: string): Promise<IntakeResult> {
  const withId = records.filter((r) => r.youtube?.videoId);
  if (withId.length === 0) return { approved: [], rejected: [], skipped: [], aiConfigured: true };

  const ids = withId.map((r) => r.youtube!.videoId!);
  const alreadyRejected = new Set(
    (await db.select({ id: rejectedVideos.videoId }).from(rejectedVideos).where(inArray(rejectedVideos.videoId, ids))).map(
      (r) => r.id
    )
  );
  const fresh = withId.filter((r) => !alreadyRejected.has(r.youtube!.videoId!));
  if (fresh.length === 0) return { approved: [], rejected: [], skipped: [], aiConfigured: true };

  const videos = await fetchVideos(fresh.map((r) => r.youtube!.videoId!), youtubeApiKey);

  let reviewer: Reviewer | "unconfigured" | "unavailable";
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn(
      "WARNING: ANTHROPIC_API_KEY is not set — new videos are added as pending WITHOUT AI review or summary."
    );
    reviewer = "unconfigured";
  } else {
    try {
      reviewer = await createReviewer();
    } catch (error) {
      console.error("AI review unavailable (did you run `npm ci` after pulling?):", error);
      reviewer = "unavailable";
    }
  }

  const result = await decideIntake(
    fresh.map((record) => ({ record, video: videos.get(record.youtube!.videoId!) })),
    reviewer
  );

  for (const { record, video, decision } of result.approved) {
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
      ...videoEnrichmentFields(video),
      ...(decision && {
        aiSummary: decision.content.summary,
        aiOverview: decision.content.overview,
        aiHighlights: decision.content.highlights,
        aiLevel: decision.content.level,
        aiGeneratedAt: new Date(),
      }),
    };
    await db
      .insert(coursesTable)
      .values(row)
      .onConflictDoUpdate({ target: coursesTable.slug, set: { updatedAt: sql`now()` } });
  }

  for (const r of result.rejected) {
    await db
      .insert(rejectedVideos)
      .values({ videoId: r.videoId, title: r.title, reason: r.reason, source: r.source })
      .onConflictDoNothing();
  }

  return result;
}

/** The body of the admin digest email for an intake run. */
export function intakeDigestHtml(result: IntakeResult, intro: string): string {
  const approved = result.approved
    .map(({ record, decision }) => {
      const summary = decision ? ` — <em>${escapeHtml(decision.content.summary)}</em>` : "";
      return `<li><a href="${escapeHtml(record.sourceUrl)}">${escapeHtml(record.title)}</a> · ${escapeHtml(record.category)}${summary}</li>`;
    })
    .join("");
  const rejected = result.rejected
    .map((r) => `<li>${escapeHtml(r.title)} — ${escapeHtml(r.reason)}</li>`)
    .join("");
  const noAi = result.aiConfigured
    ? ""
    : "<p><strong>Ojo:</strong> ANTHROPIC_API_KEY no está configurada; estos vídeos NO pasaron la revisión IA ni tienen resumen.</p>";
  const skipped =
    result.skipped.length > 0
      ? `<p>${result.skipped.length} vídeo(s) no se pudieron revisar y se reintentarán en la próxima ejecución.</p>`
      : "";

  return `
    <p>${intro}</p>
    ${noAi}
    ${approved ? `<p><strong>Listos para aprobar (${result.approved.length})</strong> en <a href="https://cursos.unaividal.com/admin">/admin</a>:</p><ul>${approved}</ul>` : ""}
    ${rejected ? `<p><strong>Descartados por la IA (${result.rejected.length})</strong> — por si alguno merece rescatarse:</p><ul>${rejected}</ul>` : ""}
    ${skipped}
  `;
}
