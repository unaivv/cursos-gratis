import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseBySlug, readAllCourses, readCategories } from "@/lib/courses/read";
import { catalogNumber } from "@/lib/courses/catalog-number";
import { courseBlurb } from "@/lib/courses/blurb";
import { isIndexableCourse } from "@/lib/courses/depth";
import { descriptionExcerpt, formatTimestamp } from "@/lib/courses/youtube-meta";
import { buildQuickAnswer, courseDateModified, courseThumbnailUrl } from "@/lib/courses/quick-answer";
import { AI_LEVEL_LABEL } from "@/lib/courses/ai-content";
import { recommendationRank, resolveRelated } from "@/lib/courses/ai-analysis";
import { getGuide, guidesForCategory } from "@/lib/editorial/guides";
import {
  ANALYSIS_TOC,
  AudienceSections,
  FaqSection,
  RelatedPathSection,
  StudySections,
  SyllabusBlocks,
  VerdictSection,
} from "@/components/courses/CourseAnalysisSections";
import { VerdictBadge } from "@/components/courses/VerdictBadge";
import { QuickAnswer } from "@/components/courses/QuickAnswer";
import { CourseCard } from "@/components/courses/CourseCard";
import { OutboundCourseLink } from "@/components/courses/OutboundCourseLink";
import { PlatformStamp } from "@/components/courses/PlatformStamp";
import { VerifiedBadge } from "@/components/courses/VerifiedBadge";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdsterraBanner } from "@/components/ads/AdsterraBanner";
import { AdsterraNativeBanner } from "@/components/ads/AdsterraNativeBanner";
import { ADSTERRA_BANNERS } from "@/components/ads/adsterra";
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
  const title = course.aiAnalysis ? `${course.title}: análisis y plan de estudio` : course.title;
  return {
    title,
    description,
    alternates: { canonical: `/${category}/${slug}` },
    // Pages without original editorial content (the analysis or a real
    // editor note) stay reachable but out of the index — see
    // lib/courses/depth.ts. They become indexable once analyzed.
    ...(!isIndexableCourse(course) && { robots: { index: false, follow: true } }),
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const [course, categories, allCourses] = await Promise.all([
    getCourseBySlug(category, slug),
    readCategories(),
    readAllCourses(),
  ]);
  if (!course) notFound();
  const categoryCourses = allCourses.filter((c) => c.category === category);

  const categoryInfo = categories.find((c) => c.slug === category);
  const categorySlugs = categoryCourses.map((c) => c.slug);
  const number = catalogNumber(category, slug, categorySlugs);
  const courseUrl = `${SITE_URL}/${category}/${slug}`;
  const categoryName = categoryInfo?.name ?? category;

  const blurb = courseBlurb(course, categoryName);
  const summary = course.aiSummary ?? blurb;
  const excerpt = course.description ? descriptionExcerpt(course.description) : null;
  const chapters = course.chapters ?? [];
  const analysis = course.aiAnalysis;
  const pathCourses = analysis ? resolveRelated(analysis, allCourses, slug) : [];
  const pathSlugs = new Set(pathCourses.map((r) => r.course.slug));
  // Same category, best editorial verdict first, minus what the analysis already links.
  const related = categoryCourses
    .filter((c) => c.slug !== slug && !pathSlugs.has(c.slug))
    .sort((a, b) => recommendationRank(b.aiAnalysis) - recommendationRank(a.aiAnalysis))
    .slice(0, 4);
  const guides = [
    ...guidesForCategory(category).slice(0, 2),
    ...(course.platform === "youtube" ? [getGuide("seguir-un-curso-de-youtube-hasta-el-final")] : []),
    getGuide("como-elegir-un-curso-gratis-bueno"),
  ].filter((g): g is NonNullable<typeof g> => Boolean(g));
  const platformLabel = course.platform === "youtube" ? "YouTube" : "Udemy";

  const quickAnswer = buildQuickAnswer(course, categoryName);
  const thumbnailUrl = courseThumbnailUrl(course);

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
    inLanguage: "es",
    ...(course.publishedAt && { datePublished: course.publishedAt }),
    dateModified: courseDateModified(course),
    ...(thumbnailUrl && { image: thumbnailUrl }),
    ...(course.author && { author: { "@type": "Person", name: course.author } }),
    ...(course.aiLevel && { educationalLevel: AI_LEVEL_LABEL[course.aiLevel] }),
    ...(analysis && {
      teaches: analysis.outcomes,
      ...(analysis.prerequisites.length > 0 && { coursePrerequisites: analysis.prerequisites }),
      review: {
        "@type": "Review",
        author: { "@type": "Organization", name: "cursos.unaividal.com", url: SITE_URL },
        reviewBody: analysis.verdict.summary,
        reviewRating: { "@type": "Rating", ratingValue: analysis.verdict.score, bestRating: 5, worstRating: 1 },
      },
    }),
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      ...(course.durationSeconds && { courseWorkload: `PT${Math.max(1, Math.round(course.durationSeconds / 60))}M` }),
    },
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "EUR",
      category: "Free",
    },
    isAccessibleForFree: true,
  };

  const faqJsonLd = analysis && {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: analysis.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
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
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
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

        <p className="mb-4 text-ink-muted">{course.aiSummary ?? blurb}</p>
        {analysis && (
          <p className="mb-6">
            <VerdictBadge verdict={analysis.verdict} />
          </p>
        )}

        <p className="mb-8 font-mono text-xs text-ink-muted">
          <VerifiedBadge date={course.lastVerifiedAt} /> — sigue siendo gratis en{" "}
          {course.platform === "youtube" ? "YouTube" : "Udemy"}
        </p>

        <OutboundCourseLink course={course} />
      </div>

      <QuickAnswer answer={quickAnswer} />

      <AdsterraBanner unit={ADSTERRA_BANNERS.rectangle} />

      {analysis && (
        <nav aria-label="En esta ficha" className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-ink-muted">
          <span>En esta ficha:</span>
          {ANALYSIS_TOC.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="underline underline-offset-2 hover:text-ink">
              {item.label}
            </a>
          ))}
        </nav>
      )}

      {analysis && <VerdictSection analysis={analysis} />}

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
        </section>
      )}

      {analysis && <AudienceSections analysis={analysis} />}

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

      {(chapters.length > 0 || (analysis?.syllabus.length ?? 0) > 0) && (
        <section aria-labelledby="estructura" className="flex scroll-mt-24 flex-col gap-4">
          <h2 id="estructura" className="font-serif text-xl text-ink">
            Estructura del curso
          </h2>
          {analysis && <SyllabusBlocks analysis={analysis} />}
          {chapters.length > 0 && (
            <>
              <h3 className="mt-2 font-mono text-[11px] uppercase tracking-wide text-ink-muted">
                {course.youtube?.playlistId ? "Lecciones" : "Capítulos del vídeo"}
              </h3>
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
            </>
          )}
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

      {analysis && <StudySections analysis={analysis} />}

      <RelatedPathSection related={pathCourses} />

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

      {analysis && <FaqSection faq={analysis.faq} />}

      {analysis && (
        <p className="border-t border-rule pt-4 font-mono text-[11px] leading-relaxed text-ink-muted">
          Análisis editorial elaborado con ayuda de IA a partir de la descripción, los capítulos y la duración
          publicados en {platformLabel}, y revisado según{" "}
          <Link href="/como-verificamos#analisis" className="underline underline-offset-2 hover:text-ink">
            nuestro método
          </Link>
          . El contenido del curso es obra de {course.author ?? "su autor"}; si ves algún error,{" "}
          <Link href="/contacto" className="underline underline-offset-2 hover:text-ink">
            avísanos
          </Link>
          .
        </p>
      )}

      {guides.length > 0 && (
        <section aria-labelledby="guides" className="flex flex-col gap-3 border border-rule bg-card p-5">
          <h2 id="guides" className="font-serif text-lg text-ink">
            Guías para sacarle partido
          </h2>
          <ul className="flex flex-col gap-2 text-sm">
            {guides.map((g) => (
              <li key={g.slug}>
                <Link href={`/guias/${g.slug}`} className="text-ink underline underline-offset-4 hover:text-stamp-red">
                  {g.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
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

      {/* Last thing on the page, after the editorial content and related courses. */}
      <AdsterraNativeBanner />
    </main>
  );
}
