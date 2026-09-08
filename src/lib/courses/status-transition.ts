export type CourseStatus = "pending" | "published";

/** Spec: admin-panel — "Publish/unpublish toggles public visibility". */
export function nextCourseStatus(current: CourseStatus): CourseStatus {
  return current === "published" ? "pending" : "published";
}
