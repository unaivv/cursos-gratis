"use server";

import { redirect } from "next/navigation";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { courses, type NewCourseRow } from "@/lib/db/schema";
import { flattenFormErrors, parseCourseForm } from "./courses/form-schema";

export type CourseFormState = {
  errors?: Record<string, string>;
};

function toRow(data: ReturnType<typeof parseCourseForm>["data"]): NewCourseRow {
  if (!data) throw new Error("toRow called without parsed data");
  return {
    slug: data.slug,
    title: data.title,
    author: data.author ?? null,
    platform: data.platform,
    category: data.category,
    sourceUrl: data.sourceUrl,
    freeStatus: data.freeStatus,
    status: data.status,
    lastVerifiedAt: data.lastVerifiedAt,
    youtubeVideoId: data.youtube?.videoId ?? null,
    youtubePlaylistId: data.youtube?.playlistId ?? null,
    youtubeChannelId: data.youtube?.channelId ?? null,
  };
}

/** Spec: admin-panel — "Create and edit validate the same shape". */
export async function createCourse(
  _prevState: CourseFormState,
  formData: FormData
): Promise<CourseFormState> {
  const parsed = parseCourseForm(formData);
  if (!parsed.success) return { errors: flattenFormErrors(parsed.error) };

  try {
    await db.insert(courses).values(toRow(parsed.data));
  } catch {
    return { errors: { slug: "Ya existe un curso con ese slug." } };
  }

  redirect("/admin");
}

export async function updateCourse(
  id: string,
  _prevState: CourseFormState,
  formData: FormData
): Promise<CourseFormState> {
  const parsed = parseCourseForm(formData);
  if (!parsed.success) return { errors: flattenFormErrors(parsed.error) };

  try {
    await db
      .update(courses)
      .set({ ...toRow(parsed.data), updatedAt: new Date() })
      .where(eq(courses.id, id));
  } catch {
    return { errors: { slug: "Ya existe un curso con ese slug." } };
  }

  redirect("/admin");
}

/**
 * Spec: admin-panel — "Publish/unpublish toggles public visibility".
 * No cache to invalidate (public pages are `force-dynamic`, uncached —
 * see read.ts); the caller (PublishToggleButton) calls `router.refresh()`
 * after this resolves so the admin list itself reflects the change too.
 */
export async function setCourseStatus(id: string, status: "pending" | "published") {
  await db.update(courses).set({ status, updatedAt: new Date() }).where(eq(courses.id, id));
}

/**
 * Spec: admin-panel — "Delete removes a record entirely". Confirmation
 * happens client-side (DeleteCourseButton) before this is ever called;
 * that same caller calls `router.refresh()` after this resolves.
 */
export async function deleteCourse(id: string) {
  await db.delete(courses).where(eq(courses.id, id));
}

/** Bulk version of setCourseStatus — one UPDATE for every checked row,
 * same "no cache to invalidate" note applies. No-ops on an empty
 * selection instead of running a WHERE-less UPDATE. */
export async function bulkSetCourseStatus(ids: string[], status: "pending" | "published") {
  if (ids.length === 0) return;
  await db.update(courses).set({ status, updatedAt: new Date() }).where(inArray(courses.id, ids));
}

/** Bulk version of deleteCourse — confirmation happens client-side
 * (BulkActionsBar) before this is ever called. */
export async function bulkDeleteCourses(ids: string[]) {
  if (ids.length === 0) return;
  await db.delete(courses).where(inArray(courses.id, ids));
}
