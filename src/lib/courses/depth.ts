import type { CourseRecord } from "./schema";

/**
 * A hand-written editor note only counts as editorial content on its
 * own when it's a real paragraph or two, not a one-line remark.
 */
export const MIN_EDITOR_NOTE_CHARS = 300;

/**
 * Whether a course page carries enough original editorial value to be
 * indexed: the rich analysis (src/lib/courses/ai-analysis.ts) or a
 * substantial hand-written editor note. Everything else — a ficha with
 * only the title, the source description and a short summary — stays
 * reachable for visitors but is `noindex, follow` and out of the
 * sitemap, so search engines (and AdSense) judge the site by its best
 * pages. A page becomes indexable on its own as soon as it's analyzed.
 */
export function isIndexableCourse(course: CourseRecord): boolean {
  if (course.aiAnalysis) return true;
  return (course.editorNote?.trim().length ?? 0) >= MIN_EDITOR_NOTE_CHARS;
}
