import { RECOMMENDATION_LABEL, recommendationRank } from "./ai-analysis";
import { isIndexableCourse } from "./depth";
import { formatDuration } from "./youtube-meta";
import type { CourseRecord } from "./schema";

/**
 * The FAQ at the bottom of a category page, generated from the catalog
 * itself (counts, verdicts, levels) so it never drifts from what the page
 * lists. Answers are segments — plain text or internal links — so the
 * page can render the links while the FAQPage JSON-LD gets the exact
 * same words as plain text (see faqAnswerText).
 */
export type FaqSegment = string | { href: string; label: string };
export type CategoryFaqItem = { question: string; answer: FaqSegment[] };

type GuideRef = { slug: string; title: string };

const courseHref = (course: CourseRecord) => `/${course.category}/${course.slug}`;

/** "A, B y C" */
function joinSpanish<T>(items: T[], render: (item: T) => FaqSegment[]): FaqSegment[] {
  return items.flatMap((item, index) => {
    const separator = index === 0 ? [] : index === items.length - 1 ? [" y "] : [", "];
    return [...separator, ...render(item)];
  });
}

function verdictNote(course: CourseRecord): string {
  const verdict = course.aiAnalysis?.verdict;
  const parts = [
    ...(course.author ? [`de ${course.author}`] : []),
    ...(verdict ? [`${verdict.score}/5, ${RECOMMENDATION_LABEL[verdict.recommendation].toLowerCase()}`] : []),
  ];
  return parts.length > 0 ? ` (${parts.join("; ")})` : "";
}

export function buildCategoryFaq({
  categoryName,
  courses,
  startGuide,
}: {
  categoryName: string;
  /** Every published course in the category. */
  courses: CourseRecord[];
  /** The category's main learning path, when there is one. */
  startGuide?: GuideRef;
}): CategoryFaqItem[] {
  const ranked = courses
    .filter((course) => course.aiAnalysis && isIndexableCourse(course))
    .sort((a, b) => recommendationRank(b.aiAnalysis) - recommendationRank(a.aiAnalysis));
  const best = ranked.slice(0, 3);
  const beginner = courses
    .filter((course) => course.aiLevel === "principiante")
    .sort((a, b) => recommendationRank(b.aiAnalysis) - recommendationRank(a.aiAnalysis))[0];

  const items: CategoryFaqItem[] = [];

  if (best.length > 0) {
    items.push({
      question: `¿Cuál es el mejor curso gratis de ${categoryName}?`,
      answer: [
        best.length === 1
          ? "Según nuestro análisis editorial, el mejor valorado es "
          : "Según nuestro análisis editorial, los mejor valorados son ",
        ...joinSpanish(best, (course) => [{ href: courseHref(course), label: course.title }, verdictNote(course)]),
        ". Valoramos la estructura, la profundidad para su duración y la actualidad de cada curso.",
      ],
    });
  }

  if (beginner || startGuide) {
    const answer: FaqSegment[] = [];
    if (beginner) {
      const details = [
        "de nivel principiante",
        ...(beginner.durationSeconds ? [`de ${formatDuration(beginner.durationSeconds)}`] : []),
        `en ${beginner.platform === "youtube" ? "YouTube" : "Udemy"}`,
      ].join(" ");
      answer.push("Empieza por ", { href: courseHref(beginner), label: beginner.title }, `, un curso ${details}.`);
    }
    if (startGuide) {
      answer.push(
        beginner ? " Si quieres un orden completo de principio a fin, sigue nuestra ruta " : "Sigue nuestra ruta ",
        { href: `/guias/${startGuide.slug}`, label: startGuide.title },
        "."
      );
    }
    items.push({ question: `¿Por dónde empiezo si soy principiante en ${categoryName}?`, answer });
  }

  items.push({
    question: `¿Son realmente gratis estos cursos de ${categoryName}?`,
    answer: [
      "Sí. Solo catalogamos cursos completos que se pueden seguir gratis en YouTube o Udemy, y cada ficha indica la fecha de la última comprobación. Si un curso deja de ser gratuito, lo retiramos del catálogo. Explicamos el proceso en ",
      { href: "/como-verificamos", label: "cómo verificamos los cursos" },
      ".",
    ],
  });

  if (courses.length > 0) {
    const youtube = courses.filter((course) => course.platform === "youtube").length;
    const udemy = courses.length - youtube;
    const analyzed = courses.filter((course) => course.aiAnalysis).length;
    const split = [
      ...(youtube > 0 ? [`${youtube} en YouTube`] : []),
      ...(udemy > 0 ? [`${udemy} en Udemy`] : []),
    ].join(" y ");
    items.push({
      question: `¿Cuántos cursos gratis de ${categoryName} hay?`,
      answer: [
        `Ahora mismo hay ${courses.length} curso${courses.length === 1 ? "" : "s"} gratis de ${categoryName} en el catálogo (${split})`,
        analyzed > 0 ? `, ${analyzed} de ellos con análisis editorial completo.` : ".",
      ],
    });
  }

  return items;
}

/** The answer as plain text — identical wording to what the page shows. */
export function faqAnswerText(answer: FaqSegment[]): string {
  return answer.map((segment) => (typeof segment === "string" ? segment : segment.label)).join("");
}
