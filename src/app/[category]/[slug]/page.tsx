import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseBySlug, getCoursesByCategory, readCategories } from "@/lib/courses/read";
import { catalogNumber } from "@/lib/courses/catalog-number";
import { courseBlurb } from "@/lib/courses/blurb";
import { isThinCourse } from "@/lib/courses/depth";
import { descriptionExcerpt, formatDuration, formatTimestamp } from "@/lib/courses/youtube-meta";
import { AI_LEVEL_LABEL } from "@/lib/courses/ai-content";
import { guideForCategory } from "@/lib/editorial/guides";
import { CourseCard } from "@/components/courses/CourseCard";
import { OutboundCourseLink } from "@/components/courses/OutboundCourseLink";
import { PlatformStamp } from "@/components/courses/PlatformStamp";
import { VerifiedBadge } from "@/components/courses/VerifiedBadge";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/site";

// Dynamic, not pre-rendered — see src/lib/courses/read.ts for why.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const [course, categories] = await Promise.all([getCourseBySlug(category, slug), readCategories()]);
  if (!course) return {};
  const categoryName = categories.find((c) => c.slug === category)?.name ?? category;
  const description = course.aiSummary ?? courseBlurb(course, categoryName);
  return {
    title: course.title,
    description,
    // Pages with nothing beyond what the source platform already shows
    // stay reachable but out of the index (see lib/courses/depth.ts).
    ...(isThinCourse(course) && { robots: { index: false, follow: true } }),
    openGraph: { title: course.title, description },
    twitter: { title: course.title, description },
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const [course, categories, categoryCourses] = await Promise.all([
    getCourseBySlug(category, slug),
    readCategories(),
    getCoursesByCategory(category),
  ]);
  if (!course) notFound();

  const categoryInfo = categories.find((c) => c.slug === category);
  const categorySlugs = categoryCourses.map((c) => c.slug);
  const number = catalogNumber(category, slug, categorySlugs);
  const courseUrl = `${SITE_URL}/${category}/${slug}`;
  const categoryName = categoryInfo?.name ?? category;

  const blurb = courseBlurb(course, categoryName);
  const summary = course.aiSummary ?? blurb;
  const excerpt = course.description ? descriptionExcerpt(course.description) : null;
  const chapters = course.chapters ?? [];
  const related = categoryCourses.filter((c) => c.slug !== slug).slice(0, 4);
  const guide = guideForCategory(category);
  const platformLabel = course.platform === "youtube" ? "YouTube" : "Udemy";

  const facts: { label: string; value: string }[] = [
    { label: "Plataforma", value: platformLabel },
    ...(course.aiLevel ? [{ label: "Nivel", value: AI_LEVEL_LABEL[course.aiLevel] }] : []),
    ...(course.author ? [{ label: "Autor", value: course.author }] : []),
    ...(course.durationSeconds
      ? [{ label: "Duración", value: formatDuration(course.durationSeconds) }]
      : []),
    ...(course.lessonCount
      ? [{ label: course.platform === "youtube" && !course.youtube?.playlistId ? "Capítulos" : "Lecciones", value: String(course.lessonCount) }]
      : []),
    ...(course.publishedAt
      ? [{ label: "Publicado", value: course.publishedAt.slice(0, 4) }]
      : []),
  ];

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: summary,
    provider: {
      "@type": "Organization",
      name: course.platform === "youtube" ? "YouTube" : "Udemy",
    },
    url: courseUrl,
    ...(course.author && { author: { "@type": "Person", name: course.author } }),
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "EUR",
      category: "Free",
    },
    isAccessibleForFree: true,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: categoryName, item: `${SITE_URL}/${category}` },
      { "@type": "ListItem", position: 3, name: course.title, item: courseUrl },
    ],
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <JsonLd data={courseJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <Link href={`/${category}`} className="font-mono text-xs text-ink-muted hover:text-ink">
        ← {categoryName}
      </Link>

      <div className="border border-rule bg-card p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <span className="font-mono text-sm text-ink-muted">Ficha {number}</span>
          <PlatformStamp platform={course.platform} size="lg" />
        </div>

        <h1 className="mb-2 font-serif text-3xl leading-tight text-ink">
          {course.title}
        </h1>
        {course.author && (
          <p className="mb-4 text-sm text-ink-muted">por {course.author}</p>
        )}

        <p className="mb-6 text-ink-muted">{blurb}</p>

        <p className="mb-8 font-mono text-xs text-ink-muted">
          <VerifiedBadge date={course.lastVerifiedAt} /> — sigue siendo gratis en{" "}
          {course.platform === "youtube" ? "YouTube" : "Udemy"}
        </p>

        <OutboundCourseLink course={course} />
      </div>

      <dl className="grid grid-cols-2 gap-4 border border-rule bg-card p-6 sm:grid-cols-3">
        {facts.map((fact) => (
          <div key={fact.label} className="flex flex-col gap-1">
            <dt className="font-mono text-[11px] uppercase tracking-wide text-ink-muted">{fact.label}</dt>
            <dd className="font-serif text-lg text-ink">{fact.value}</dd>
          </div>
        ))}
      </dl>

      {(course.aiOverview || (course.aiHighlights?.length ?? 0) > 0) && (
        <section aria-labelledby="overview" className="flex flex-col gap-4">
          <h2 id="overview" className="font-serif text-xl text-ink">
            De qué trata
          </h2>
          {course.aiOverview?.split("\n\n").map((paragraph) => (
            <p key={paragraph} className="text-ink-muted">
              {paragraph}
            </p>
          ))}
          {course.aiHighlights && course.aiHighlights.length > 0 && (
            <ul className="flex list-disc flex-col gap-1.5 pl-5 text-ink-muted">
              {course.aiHighlights.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          )}
          <p className="font-mono text-[11px] text-ink-muted">
            Resumen generado con IA a partir de la descripción, los capítulos y la duración
            publicados en {platformLabel}. Puede contener imprecisiones: el contenido real es el del
            curso original.
          </p>
        </section>
      )}

      {course.editorNote && (
        <section aria-labelledby="editor-note" className="flex flex-col gap-3 border-l-2 border-stamp-red pl-5">
          <h2 id="editor-note" className="font-serif text-xl text-ink">
            Nuestra nota
          </h2>
          {course.editorNote.split(/\n{2,}/).map((paragraph) => (
            <p key={paragraph} className="text-ink-muted">
              {paragraph}
            </p>
          ))}
        </section>
      )}

      {chapters.length > 0 && (
        <section aria-labelledby="syllabus" className="flex flex-col gap-3">
          <h2 id="syllabus" className="font-serif text-xl text-ink">
            {course.youtube?.playlistId ? "Lecciones del curso" : "Qué cubre, capítulo a capítulo"}
          </h2>
          <ol className="flex flex-col gap-1.5 text-sm text-ink-muted">
            {chapters.slice(0, 12).map((chapter, index) => (
              <li key={`${index}-${chapter.title}`} className="flex gap-3">
                <span className="w-14 shrink-0 font-mono text-xs text-ink-muted">
                  {chapter.start !== undefined ? formatTimestamp(chapter.start) : String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-ink">{chapter.title}</span>
              </li>
            ))}
          </ol>
          {chapters.length > 12 && (
            <details className="text-sm">
              <summary className="cursor-pointer text-ink-muted hover:text-ink">
                Ver los {chapters.length - 12} restantes
              </summary>
              <ol className="mt-2 flex flex-col gap-1.5 text-ink-muted">
                {chapters.slice(12).map((chapter, index) => (
                  <li key={`${index + 12}-${chapter.title}`} className="flex gap-3">
                    <span className="w-14 shrink-0 font-mono text-xs">
                      {chapter.start !== undefined
                        ? formatTimestamp(chapter.start)
                        : String(index + 13).padStart(2, "0")}
                    </span>
                    <span className="text-ink">{chapter.title}</span>
                  </li>
                ))}
              </ol>
            </details>
          )}
        </section>
      )}

      {excerpt && (
        <section aria-labelledby="author-description" className="flex flex-col gap-3">
          <h2 id="author-description" className="font-serif text-xl text-ink">
            Cómo lo presenta {course.author ?? "el autor"}
          </h2>
          <blockquote className="flex flex-col gap-3 border-l border-rule pl-5 text-ink-muted">
            {excerpt.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </blockquote>
          <p className="font-mono text-[11px] text-ink-muted">
            Extracto de la descripción original en {platformLabel}.
          </p>
        </section>
      )}

      {guide && (
        <p className="border border-rule bg-card p-5 text-sm text-ink-muted">
          ¿Empiezas de cero en {categoryName.toLowerCase()}? Lee{" "}
          <Link href={`/guias/${guide.slug}`} className="text-ink underline underline-offset-4 hover:text-stamp-red">
            {guide.title}
          </Link>
          .
        </p>
      )}

      {related.length > 0 && (
        <section aria-labelledby="related" className="flex flex-col gap-4">
          <h2 id="related" className="font-serif text-xl text-ink">
            Más cursos de {categoryName}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {related.map((c) => (
              <CourseCard key={c.slug} course={c} categorySlugs={categorySlugs} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
