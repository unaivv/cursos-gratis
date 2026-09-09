import { and, asc, eq } from "drizzle-orm";
import { db } from "./client";
import { courses, type CourseRow } from "./schema";

export type AdminCourseFilters = {
  status?: "pending" | "published";
  platform?: "youtube" | "udemy";
  category?: string;
};

/**
 * Admin-facing reads — every status, always fresh (no `unstable_cache`;
 * an admin editing a record must see current state, not a stale tagged
 * cache meant for the public site). Spec: admin-panel — "List every
 * course regardless of status".
 */
export async function listAllCourses(filters: AdminCourseFilters = {}): Promise<CourseRow[]> {
  const conditions = [];
  if (filters.status) conditions.push(eq(courses.status, filters.status));
  if (filters.platform) conditions.push(eq(courses.platform, filters.platform));
  if (filters.category) conditions.push(eq(courses.category, filters.category));

  return db
    .select()
    .from(courses)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(courses.slug));
}

export async function getCourseById(id: string): Promise<CourseRow | undefined> {
  const [row] = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return row;
}
