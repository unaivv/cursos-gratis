import { pgTable, text, uuid, date, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import type { CourseAnalysis } from "../courses/ai-analysis";

/**
 * Course catalog table. Replaces `content/courses/**\/*.json`.
 *
 * Spec: openspec/changes/course-catalog-mvp/specs/course-catalog/spec.md
 *       (Requirement: Course record shape)
 *       openspec/changes/admin-panel/specs/course-catalog/spec.md
 *       (MODIFIED: adds `status`; ADDED: Published-only public listing)
 */
export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  // Instructor/creator name — e.g. the specific person teaching the
  // course, not necessarily the hosting channel (freeCodeCamp publishes
  // many different instructors' courses under one channel).
  author: text("author"),
  platform: text("platform", { enum: ["youtube", "udemy"] }).notNull(),
  category: text("category").notNull(),
  sourceUrl: text("source_url").notNull(),
  // Only ever "free" — see course-catalog-mvp design.md. A course that
  // stops being free is unpublished/deleted, not relabeled.
  freeStatus: text("free_status", { enum: ["free"] }).notNull().default("free"),
  status: text("status", { enum: ["pending", "published"] }).notNull().default("pending"),
  lastVerifiedAt: date("last_verified_at").notNull(),
  // Present only for platform = "youtube" (spec: YouTube records store
  // provenance). Exactly one of youtubeVideoId/youtubePlaylistId is set —
  // a single long-form video (freeCodeCamp-style), or a playlist-shaped
  // course (e.g. midudev's live-stream-collection courses).
  youtubeVideoId: text("youtube_video_id"),
  youtubePlaylistId: text("youtube_playlist_id"),
  youtubeChannelId: text("youtube_channel_id"),
  // Original commentary written by the site owner (admin form) — the one
  // piece of per-course content that isn't derived from the source platform.
  editorNote: text("editor_note"),
  // Enrichment from the YouTube Data API (scripts/enrich-youtube.ts).
  // All nullable: Udemy blocks scraping, and older rows predate this.
  description: text("description"),
  durationSeconds: integer("duration_seconds"),
  lessonCount: integer("lesson_count"),
  // Syllabus: video chapters (with `start` seconds) or, for playlists,
  // the lesson titles in order.
  chapters: jsonb("chapters").$type<{ title: string; start?: number }[]>(),
  publishedAt: date("published_at"),
  enrichedAt: timestamp("enriched_at", { withTimezone: true }),
  // AI-written, grounded in the enrichment data above (never in the title
  // alone) and labeled as such on the page — see scripts/import-ai-content.ts.
  aiSummary: text("ai_summary"),
  aiOverview: text("ai_overview"),
  aiHighlights: jsonb("ai_highlights").$type<string[]>(),
  aiLevel: text("ai_level", { enum: ["principiante", "intermedio", "avanzado"] }),
  aiGeneratedAt: timestamp("ai_generated_at", { withTimezone: true }),
  // The rich editorial analysis (audience, outcomes, structure, verdict,
  // FAQ…) — shape and limits in src/lib/courses/ai-analysis.ts. A course
  // page is only indexable once this is set (src/lib/courses/depth.ts).
  aiAnalysis: jsonb("ai_analysis").$type<CourseAnalysis>(),
  aiAnalyzedAt: timestamp("ai_analyzed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type CourseRow = typeof courses.$inferSelect;
export type NewCourseRow = typeof courses.$inferInsert;

/**
 * YouTube videos the sync/discovery AI review decided are not real
 * courses (news, opinion, podcasts, shorts…). Remembered so they aren't
 * re-reviewed — and re-billed — on every weekly run. Not tied to the
 * courses table on purpose: a rejected video never becomes a course row.
 */
export const rejectedVideos = pgTable("rejected_videos", {
  videoId: text("video_id").primaryKey(),
  title: text("title").notNull(),
  reason: text("reason").notNull(),
  source: text("source", { enum: ["prefilter", "ai"] }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type RejectedVideoRow = typeof rejectedVideos.$inferSelect;

/**
 * Fixed MVP category taxonomy. Seeded from `content/categories.json`
 * (scripts/seed-categories.ts); admin CRUD for categories is out of scope
 * for this change (see proposal.md — Out of Scope).
 */
export const categories = pgTable("categories", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
});

export type CategoryRow = typeof categories.$inferSelect;

/**
 * Visitor-submitted "sugerir curso" form (public /sugerir page). Reviewed
 * by hand — same trust model as everything else in the catalog, a
 * suggestion never auto-publishes a course.
 */
export const courseSuggestions = pgTable("course_suggestions", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseUrl: text("course_url").notNull(),
  note: text("note"),
  submitterEmail: text("submitter_email"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type CourseSuggestionRow = typeof courseSuggestions.$inferSelect;
export type NewCourseSuggestionRow = typeof courseSuggestions.$inferInsert;

/**
 * Every non-empty /buscar query, logged fire-and-forget — the raw
 * material for "peticiones populares" on the home page (see
 * src/lib/courses/popular-searches.ts). Not tied to a session/user, just
 * a query string and a timestamp.
 */
export const searchQueries = pgTable("search_queries", {
  id: uuid("id").primaryKey().defaultRandom(),
  query: text("query").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type SearchQueryRow = typeof searchQueries.$inferSelect;
