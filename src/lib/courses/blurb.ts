/**
 * A short, honest one-line summary for a course detail page — built only
 * from data we actually have (category, platform, author). Deliberately
 * does NOT claim a syllabus, duration, level, or prerequisites: we don't
 * have that data (Udemy blocks scraping, YouTube doesn't expose it), and
 * inventing plausible-sounding specifics would be worse than saying
 * nothing. See openspec design notes / conversation history for why this
 * stays a template rather than per-course content.
 */
export function courseBlurb(
  course: { platform: "youtube" | "udemy"; author?: string },
  categoryName: string
): string {
  const platformLabel = course.platform === "youtube" ? "YouTube" : "Udemy";
  return course.author
    ? `Curso gratuito de ${categoryName} en ${platformLabel}, impartido por ${course.author}.`
    : `Curso gratuito de ${categoryName} en ${platformLabel}.`;
}
