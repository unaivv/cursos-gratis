import { formatDuration } from "./youtube-meta";

/**
 * A short, honest summary for a course detail page — built only from
 * data we actually have (category, platform, author and, when the
 * YouTube enrichment ran, duration / lesson count). Deliberately does
 * NOT claim a level or prerequisites: we don't have that data, and
 * inventing plausible-sounding specifics would be worse than saying
 * nothing.
 */
export function courseBlurb(
  course: {
    platform: "youtube" | "udemy";
    author?: string;
    durationSeconds?: number;
    lessonCount?: number;
  },
  categoryName: string
): string {
  const platformLabel = course.platform === "youtube" ? "YouTube" : "Udemy";
  const base = course.author
    ? `Curso gratuito de ${categoryName} en ${platformLabel}, impartido por ${course.author}`
    : `Curso gratuito de ${categoryName} en ${platformLabel}`;

  const facts: string[] = [];
  if (course.lessonCount) facts.push(`${course.lessonCount} lecciones`);
  if (course.durationSeconds) facts.push(`${formatDuration(course.durationSeconds)} de contenido`);
  return facts.length > 0 ? `${base}. ${facts.join(" · ")}.` : `${base}.`;
}
