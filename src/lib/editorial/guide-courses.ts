import { recommendationRank } from "@/lib/courses/ai-analysis";
import type { CourseRecord } from "@/lib/courses/schema";
import type { Guide } from "./guides";

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/** Whole-word-ish match so "go" doesn't hit "google" and "ia" doesn't hit "media". */
function hasKeyword(haystack: string, keyword: string): boolean {
  const escaped = normalize(keyword).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}($|[^a-z0-9])`).test(haystack);
}

/**
 * Picks catalog courses for a guide at render time, so a guide never
 * links to a hardcoded slug that may have been unpublished. Courses in
 * the guide's categories that mention its keywords (title, summary,
 * highlights) come first, best editorial verdict first; if too few
 * match, the rest of the category (by verdict) fills the list.
 */
export function matchGuideCourses(guide: Guide, courses: CourseRecord[], limit = 6): CourseRecord[] {
  const categories = guide.courseMatch?.categories ?? (guide.categorySlug ? [guide.categorySlug] : []);
  if (categories.length === 0) return [];
  const keywords = guide.courseMatch?.keywords ?? [];
  const pool = courses.filter((course) => categories.includes(course.category));

  const scored = pool.map((course) => {
    const text = normalize([course.title, course.aiSummary ?? "", ...(course.aiHighlights ?? [])].join(" "));
    const hits = keywords.filter((keyword) => hasKeyword(text, keyword)).length;
    // The guide's own category outranks the ones it merely draws from.
    const home = course.category === (guide.categorySlug ?? categories[0]) ? 1 : 0;
    return { course, hits, home, rank: recommendationRank(course.aiAnalysis) };
  });

  const byQuality = (a: (typeof scored)[number], b: (typeof scored)[number]) =>
    b.rank - a.rank || b.hits - a.hits || b.home - a.home || a.course.title.localeCompare(b.course.title);

  const matched = scored.filter((s) => s.hits > 0).sort(byQuality);
  const fallback = keywords.length > 0 ? scored.filter((s) => s.hits === 0 && s.home === 1).sort(byQuality) : scored.sort(byQuality);
  return [...matched, ...fallback].slice(0, limit).map((s) => s.course);
}
