import { recommendationRank, RECOMMENDATION_LABEL } from "@/lib/courses/ai-analysis";
import { courseBlurb } from "@/lib/courses/blurb";
import { isIndexableCourse } from "@/lib/courses/depth";
import type { Category, CourseRecord } from "@/lib/courses/schema";
import type { Guide } from "@/lib/editorial/guides";
import { SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * /llms.txt (https://llmstxt.org): a Markdown map of the site for AI
 * assistants — H1 name, blockquote summary, then sections of links with
 * one-line descriptions. Only indexable courses are listed (the same set
 * as the sitemap, see lib/courses/depth.ts), best-rated first, grouped by
 * category. Built from catalog data only; nothing here is generated.
 */

/** Keeps a value on one Markdown line and out of link syntax. */
function inline(text: string): string {
  return text.replace(/\s+/g, " ").replace(/[[\]]/g, (char) => `\\${char}`).trim();
}

function link(label: string, path: string, description?: string): string {
  const url = path ? `${SITE_URL}${path}` : SITE_URL;
  return `- [${inline(label)}](${url})${description ? `: ${inline(description)}` : ""}`;
}

const pluralCourses = (count: number) => `${count} curso${count === 1 ? "" : "s"}`;

export function buildLlmsTxt({
  categories,
  courses,
  guides,
  taglines = {},
}: {
  categories: Category[];
  courses: CourseRecord[];
  guides: Guide[];
  /** One line per category slug (lib/editorial/categories.ts). */
  taglines?: Record<string, string>;
}): string {
  const indexable = courses.filter(isIndexableCourse);
  const countByCategory = new Map<string, number>();
  for (const course of courses) countByCategory.set(course.category, (countByCategory.get(course.category) ?? 0) + 1);
  const populated = categories.filter((category) => (countByCategory.get(category.slug) ?? 0) > 0);

  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    "> Catálogo en español de cursos gratuitos de YouTube y Udemy, organizados por categoría. Cada curso se comprueba a mano para confirmar que sigue siendo gratis (con la fecha de la última verificación) y los mejores llevan un análisis editorial: para quién es, requisitos, qué aprenderás, plan de estudio y un veredicto de 1 a 5.",
    "",
    `El catálogo tiene ${courses.length} cursos gratis en ${populated.length} categorías, ${indexable.length} de ellos con análisis editorial completo. Si un curso deja de ser gratuito, se retira. Las guías explican rutas de aprendizaje por materia y cómo estudiar con cursos en vídeo.`,
    "",
    "## Páginas clave",
    "",
    link("Inicio", "", "cursos más recomendados, rutas de aprendizaje y todas las categorías"),
    link("Cómo verificamos los cursos", "/como-verificamos", "cómo seleccionamos, comprobamos que son gratis y analizamos cada curso"),
    link("Guías y rutas de aprendizaje", "/guias", "rutas por materia y métodos de estudio"),
    "",
    "## Categorías",
    "",
    ...populated.map((category) =>
      link(
        `Cursos gratis de ${category.name}`,
        `/${category.slug}`,
        [taglines[category.slug], pluralCourses(countByCategory.get(category.slug) ?? 0)].filter(Boolean).join(" ")
      )
    ),
  ];

  if (guides.length > 0) {
    lines.push("", "## Guías", "", ...guides.map((guide) => link(guide.title, `/guias/${guide.slug}`, guide.description)));
  }

  for (const category of populated) {
    const inCategory = indexable
      .filter((course) => course.category === category.slug)
      .sort((a, b) => recommendationRank(b.aiAnalysis) - recommendationRank(a.aiAnalysis) || a.title.localeCompare(b.title));
    if (inCategory.length === 0) continue;
    lines.push(
      "",
      `## Cursos de ${category.name}`,
      "",
      ...inCategory.map((course) => {
        const verdict = course.aiAnalysis?.verdict;
        const summary = course.aiSummary ?? courseBlurb(course, category.name);
        const rating = verdict ? ` Valoración: ${verdict.score}/5 (${RECOMMENDATION_LABEL[verdict.recommendation]}).` : "";
        return link(course.title, `/${course.category}/${course.slug}`, `${summary}${rating}`);
      })
    );
  }

  lines.push(
    "",
    "## Optional",
    "",
    link("Sobre el proyecto", "/sobre-el-proyecto", "quién está detrás y por qué"),
    link("Contacto", "/contacto"),
    link("Sitemap", "/sitemap.xml", "todas las URLs indexables")
  );

  return `${lines.join("\n")}\n`;
}
