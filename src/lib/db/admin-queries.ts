import { asc, eq } from "drizzle-orm";
import { db } from "./client";
import { courses, type CourseRow } from "./schema";

/**
 * Admin-facing reads — every status, always fresh (no `unstable_cache`;
 * an admin editing a record must see current state, not a stale tagged
 * cache meant for the public site). Spec: admin-panel — "List every
 * course regardless of status".
 */
export async function listAllCourses(): Promise<CourseRow[]> {
  return db.select().from(courses).orderBy(asc(courses.slug));
}

export async function getCourseById(id: string): Promise<CourseRow | undefined> {
  const [row] = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return row;
}
