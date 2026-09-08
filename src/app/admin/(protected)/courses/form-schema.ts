import { z } from "zod";
import { courseRecordSchema } from "@/lib/courses/schema";

/**
 * Builds a candidate course record from raw form input, then validates it
 * against the same `courseRecordSchema` the ingestion pipeline uses.
 * Spec: admin-panel — "Create and edit validate the same shape as
 * ingestion".
 */
export function parseCourseForm(formData: FormData) {
  const platform = String(formData.get("platform") ?? "");
  const youtubeVideoId = String(formData.get("youtubeVideoId") ?? "").trim();
  const youtubePlaylistId = String(formData.get("youtubePlaylistId") ?? "").trim();
  const youtubeChannelId = String(formData.get("youtubeChannelId") ?? "").trim();

  const author = String(formData.get("author") ?? "").trim();

  const candidate = {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    ...(author ? { author } : {}),
    platform,
    category: String(formData.get("category") ?? "").trim(),
    sourceUrl: String(formData.get("sourceUrl") ?? "").trim(),
    freeStatus: "free" as const,
    status: String(formData.get("status") ?? "pending"),
    lastVerifiedAt: String(formData.get("lastVerifiedAt") ?? "").trim(),
    ...(platform === "youtube" && (youtubeVideoId || youtubePlaylistId) && youtubeChannelId
      ? {
          youtube: {
            ...(youtubeVideoId ? { videoId: youtubeVideoId } : {}),
            ...(youtubePlaylistId ? { playlistId: youtubePlaylistId } : {}),
            channelId: youtubeChannelId,
          },
        }
      : {}),
  };

  return courseRecordSchema.safeParse(candidate);
}

/** Flattens a Zod error into one message per field, for form display. */
export function flattenFormErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "form");
    if (!errors[field]) errors[field] = issue.message;
  }
  return errors;
}
