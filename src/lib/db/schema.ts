import { pgTable, text, uuid, date, timestamp } from "drizzle-orm/pg-core";

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
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type CourseRow = typeof courses.$inferSelect;
export type NewCourseRow = typeof courses.$inferInsert;

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
