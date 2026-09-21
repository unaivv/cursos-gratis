import type { CourseRecord } from "./schema";

/**
 * A course page is "thin" when it has nothing beyond what the source
 * platform already shows: no syllabus, no author excerpt, no editor
 * note, no duration. Thin pages stay reachable but are kept out of the
 * index and the sitemap — a catalog of hundreds of near-identical pages
 * is what search engines and AdSense read as low-value content.
 */
export function isThinCourse(course: CourseRecord): boolean {
  return (
    !course.editorNote &&
    !course.chapters?.length &&
    !course.description &&
    !course.durationSeconds
  );
}
