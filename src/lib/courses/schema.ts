import { z } from "zod";
import { courseAnalysisSchema } from "./ai-analysis";

/**
 * A course record. Storage: the `courses` table (src/lib/db/schema.ts) —
 * this Zod schema is the validation/shape contract, not a file format
 * (superseded the git-JSON model as of the admin-panel change).
 *
 * Spec: openspec/changes/course-catalog-mvp/specs/course-catalog/spec.md
 * — Requirement: Course record shape.
 * Spec: openspec/changes/admin-panel/specs/course-catalog/spec.md —
 * MODIFIED: adds `status`.
 */
export const courseRecordSchema = z
  .object({
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case"),
    title: z.string().min(1),
    // Instructor/creator name — not necessarily the hosting channel.
    author: z.string().min(1).optional(),
    platform: z.enum(["youtube", "udemy"]),
    category: z.string().min(1),
    sourceUrl: z.string().url(),
    // Only ever "free" — a record that stops being free is unpublished/
    // deleted, not relabeled. See spec: Free-only listing.
    freeStatus: z.literal("free"),
    status: z.enum(["pending", "published"]).default("pending"),
    lastVerifiedAt: z.string().date(),
    // Original commentary by the site owner (admin-only field).
    editorNote: z.string().min(1).optional(),
    // Enrichment from the YouTube API (scripts/enrich-youtube.ts).
    description: z.string().min(1).optional(),
    durationSeconds: z.number().int().positive().optional(),
    lessonCount: z.number().int().positive().optional(),
    chapters: z
      .array(z.object({ title: z.string().min(1), start: z.number().int().nonnegative().optional() }))
      .optional(),
    publishedAt: z.string().date().optional(),
    // AI-written content (scripts/import-ai-content.ts), grounded in the
    // fields above.
    aiSummary: z.string().min(1).optional(),
    aiOverview: z.string().min(1).optional(),
    aiHighlights: z.array(z.string().min(1)).optional(),
    aiLevel: z.enum(["principiante", "intermedio", "avanzado"]).optional(),
    // Rich editorial analysis (src/lib/courses/ai-analysis.ts).
    aiAnalysis: courseAnalysisSchema.optional(),
    // Exactly one of videoId/playlistId — a single long-form video
    // (freeCodeCamp-style), or a playlist-shaped course (e.g. midudev's
    // live-stream-collection courses, which don't exist as one video).
    youtube: z
      .object({
        videoId: z.string().min(1).optional(),
        playlistId: z.string().min(1).optional(),
        channelId: z.string().min(1),
      })
      .optional(),
  })
  .superRefine((record, ctx) => {
    if (record.platform === "youtube" && !record.youtube) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["youtube"],
        message: "youtube provenance (videoId or playlistId, plus channelId) is required when platform is 'youtube'",
      });
    }
    if (record.youtube && !record.youtube.videoId && !record.youtube.playlistId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["youtube"],
        message: "youtube provenance needs a videoId or a playlistId",
      });
    }
  });

export type CourseRecord = z.infer<typeof courseRecordSchema>;

export const categorySchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
});

export type Category = z.infer<typeof categorySchema>;
