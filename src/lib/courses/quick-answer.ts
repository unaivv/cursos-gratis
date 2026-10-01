import { AI_LEVEL_LABEL } from "./ai-content";
import { RECOMMENDATION_LABEL } from "./ai-analysis";
import { formatDuration } from "./youtube-meta";
import type { CourseRecord } from "./schema";

/**
 * The answer-first block at the top of a course page ("Respuesta rápida"):
 * the handful of facts a reader — or an AI assistant quoting the page —
 * wants before anything else. Built only from data we have; any fact
 * that's missing is simply left out, so a course without the editorial
 * analysis still gets a shorter, honest block.
 */
export type QuickAnswerFact = { label: string; value: string };

export type QuickAnswer = {
  /** One plain sentence that answers "what is this and is it worth it?". */
  sentence: string;
  facts: QuickAnswerFact[];
};

const platformLabel = (platform: CourseRecord["platform"]) => (platform === "youtube" ? "YouTube" : "Udemy");

/** "1 de septiembre de 2026" from an ISO date ("2026-09-01"), timezone-proof. */
export function formatSpanishDate(isoDate: string): string {
  const date = new Date(`${isoDate.slice(0, 10)}T00:00:00Z`);
  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    date
  );
}

/** "3 h 20 min · 42 lecciones" — whichever of the two is known, or null. */
export function courseLength(course: Pick<CourseRecord, "durationSeconds" | "lessonCount" | "platform" | "youtube">): string | null {
  const unit = course.platform === "youtube" && !course.youtube?.playlistId ? "capítulos" : "lecciones";
  const parts = [
    ...(course.durationSeconds ? [formatDuration(course.durationSeconds)] : []),
    ...(course.lessonCount ? [`${course.lessonCount} ${unit}`] : []),
  ];
  return parts.length > 0 ? parts.join(" · ") : null;
}

export function buildQuickAnswer(course: CourseRecord, categoryName: string): QuickAnswer {
  const analysis = course.aiAnalysis;
  const platform = platformLabel(course.platform);
  const level = course.aiLevel ? AI_LEVEL_LABEL[course.aiLevel] : null;
  const length = courseLength(course);

  const facts: QuickAnswerFact[] = [
    ...(analysis
      ? [
          {
            label: "Veredicto",
            value: `${analysis.verdict.score}/5 · ${RECOMMENDATION_LABEL[analysis.verdict.recommendation]}`,
          },
          { label: "Para quién", value: analysis.audience.forWho[0] },
        ]
      : []),
    ...(level ? [{ label: "Nivel", value: level }] : []),
    ...(length ? [{ label: "Duración", value: length }] : []),
    { label: "Precio", value: `Gratis en ${platform}` },
    ...(course.author ? [{ label: "Autor", value: course.author }] : []),
    ...(course.publishedAt ? [{ label: "Publicado", value: course.publishedAt.slice(0, 4) }] : []),
    ...(analysis?.studyPlan.weeks
      ? [
          {
            label: "Plan sugerido",
            value: analysis.studyPlan.hoursPerWeek
              ? `${analysis.studyPlan.weeks} sem. · ${analysis.studyPlan.hoursPerWeek} h/sem.`
              : `${analysis.studyPlan.weeks} sem.`,
          },
        ]
      : []),
    { label: "Verificado", value: `el ${formatSpanishDate(course.lastVerifiedAt)}` },
  ];

  const descriptor = [
    `Curso gratis de ${categoryName}`,
    ...(level ? [`de nivel ${level.toLowerCase()}`] : []),
    `en ${platform}`,
    ...(course.author ? [`impartido por ${course.author}`] : []),
  ].join(" ");
  const sentence = [
    `${descriptor}${course.durationSeconds ? ` (${formatDuration(course.durationSeconds)})` : ""}.`,
    ...(analysis
      ? [
          `Nuestra valoración: ${analysis.verdict.score}/5, ${RECOMMENDATION_LABEL[analysis.verdict.recommendation].toLowerCase()}.`,
        ]
      : []),
    `Comprobamos que sigue siendo gratis el ${formatSpanishDate(course.lastVerifiedAt)}.`,
  ].join(" ");

  return { sentence, facts };
}

/** The most recent change to the page's content: analysis, verification or row edit. */
export function courseDateModified(course: Pick<CourseRecord, "aiAnalyzedAt" | "lastVerifiedAt" | "updatedAt">): string {
  const candidates = [course.aiAnalyzedAt, course.updatedAt, course.lastVerifiedAt].filter(
    (value): value is string => Boolean(value)
  );
  return candidates.reduce((latest, value) => (Date.parse(value) > Date.parse(latest) ? value : latest));
}

/** YouTube's public thumbnail for a single-video course (playlists have no stable one). */
export function courseThumbnailUrl(course: Pick<CourseRecord, "youtube">): string | null {
  const videoId = course.youtube?.videoId;
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;
}
