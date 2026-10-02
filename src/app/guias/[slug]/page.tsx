import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getGuide,
  GUIDE_KIND_LABEL,
  readingMinutes,
  relatedGuides,
  sectionId,
} from "@/lib/editorial/guides";
import { matchGuideCourses } from "@/lib/editorial/guide-courses";
import { readAllCourses, readCategories } from "@/lib/courses/read";
import { CourseCard } from "@/components/courses/CourseCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdsterraBanner, AdsterraLeaderboard } from "@/components/ads/AdsterraBanner";
import { AdsterraNativeBanner } from "@/components/ads/AdsterraNativeBanner";
import { Fragment } from "react";
import { SITE_URL } from "@/lib/site";

// Dynamic for the same reason as every other page — see src/lib/courses/read.ts.
export const dynamic = "force-dynamic";

const AUTHOR = { "@type": "Person", name: "Unai Vidal", url: "https://unaividal.com" };

/** "2026-09-30" → "30 de septiembre de 2026". */
function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guias/${guide.slug}` },
    authors: [{ name: "Unai Vidal", url: "https://unaividal.com" }],
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.description,
      publishedTime: guide.published,
      modifiedTime: guide.updated,
      authors: ["Unai Vidal"],
    },
    twitter: { title: guide.title, description: guide.description },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const needsCourses = Boolean(guide.categorySlug || guide.courseMatch?.categories?.length);
  const [courses, categories] = needsCourses
    ? await Promise.all([readAllCourses(), readCategories()])
    : [[], []];
  const featured = matchGuideCourses(guide, courses, 6);
  const categoryName = categories.find((c) => c.slug === guide.categorySlug)?.name;
  const slugsByCategory = new Map<string, string[]>();
  for (const course of courses) {
    slugsByCategory.set(course.category, [...(slugsByCategory.get(course.category) ?? []), course.slug]);
  }
  const moreGuides = relatedGuides(guide, 4);
  const guideUrl = `${SITE_URL}/guias/${guide.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.published,
    dateModified: guide.updated,
    inLanguage: "es",
    mainEntityOfPage: guideUrl,
    url: guideUrl,
    articleSection: GUIDE_KIND_LABEL[guide.kind],
    author: AUTHOR,
    publisher: AUTHOR,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Guías", item: `${SITE_URL}/guias` },
      { "@type": "ListItem", position: 3, name: guide.title, item: guideUrl },
    ],
  };

  const faqJsonLd = guide.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: guide.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }
    : null;

  // Mid-article rectangle goes after this section (none for one-section guides).
  const midSectionIndex = guide.sections.length > 1 ? Math.floor(guide.sections.length / 2) - 1 : -1;

  const toc = [
    ...guide.sections.map((section) => ({ id: sectionId(section.heading), label: section.heading })),
    ...(guide.faq?.length ? [{ id: "preguntas-frecuentes", label: "Preguntas frecuentes" }] : []),
    ...(featured.length > 0 ? [{ id: "cursos", label: "Cursos del catálogo" }] : []),
  ];

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-16">
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      <div className="flex flex-col gap-4">
        <nav aria-label="Ruta de navegación" className="flex gap-2 font-mono text-xs text-ink-muted">
          <Link href="/" className="hover:text-ink">
            inicio
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/guias" className="hover:text-ink">
            guías
          </Link>
        </nav>
        <span className="text-sm text-stamp-red">{GUIDE_KIND_LABEL[guide.kind]}</span>
        <h1 className="font-serif text-3xl leading-tight text-ink md:text-4xl">{guide.title}</h1>
        <p className="font-mono text-xs text-ink-muted">
          Por{" "}
          <Link href="/sobre-el-proyecto" rel="author" className="underline underline-offset-2 hover:text-ink">
            Unai Vidal
          </Link>{" "}
          · publicada el <time dateTime={guide.published}>{formatDate(guide.published)}</time>
          {guide.updated !== guide.published && (
            <>
              {" "}
              · actualizada el <time dateTime={guide.updated}>{formatDate(guide.updated)}</time>
            </>
          )}{" "}
          · {readingMinutes(guide)} min de lectura
        </p>
        <p className="text-lg text-ink-muted">{guide.intro}</p>
      </div>

      <AdsterraLeaderboard />

      {toc.length > 2 && (
        <nav aria-labelledby="toc-heading" className="border border-rule bg-card p-5">
          <h2 id="toc-heading" className="mb-3 font-mono text-[11px] uppercase tracking-wide text-ink-muted">
            En esta guía
          </h2>
          <ol className="flex flex-col gap-1.5 text-sm">
            {toc.map((item, index) => (
              <li key={item.id} className="flex gap-3">
                <span className="w-6 shrink-0 font-mono text-xs leading-5 text-ink-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <a href={`#${item.id}`} className="text-ink underline decoration-rule underline-offset-4 hover:text-stamp-red">
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {guide.sections.map((section, sectionIndex) => {
        const id = sectionId(section.heading);
        const List = section.ordered ? "ol" : "ul";
        return (
          <Fragment key={section.heading}>
            <section aria-labelledby={id} className="flex flex-col gap-4">
              <h2 id={id} className="scroll-mt-24 font-serif text-2xl text-ink">
                {section.heading}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="text-ink-muted">
                  {paragraph}
                </p>
              ))}
              {section.steps && (
                <List className={`flex flex-col gap-2 pl-5 text-ink-muted ${section.ordered ? "list-decimal" : "list-disc"}`}>
                  {section.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </List>
              )}
              {section.links && section.links.length > 0 && (
                <ul className="flex flex-col gap-1 border-l-2 border-stamp-red pl-4 text-sm">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-ink underline underline-offset-4 hover:text-stamp-red">
                        {link.label} →
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            {sectionIndex === midSectionIndex && <AdsterraBanner name="rectangle" />}
          </Fragment>
        );
      })}

      <AdsterraLeaderboard />

      {guide.faq && guide.faq.length > 0 && (
        <section aria-labelledby="preguntas-frecuentes" className="flex flex-col gap-5 border-t border-rule pt-10">
          <h2 id="preguntas-frecuentes" className="scroll-mt-24 font-serif text-2xl text-ink">
            Preguntas frecuentes
          </h2>
          <dl className="flex flex-col gap-6">
            {guide.faq.map((item) => (
              <div key={item.question} className="flex flex-col gap-1.5">
                <dt className="font-medium text-ink">{item.question}</dt>
                <dd className="text-ink-muted">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {featured.length > 0 && (
        <section aria-labelledby="cursos" className="flex flex-col gap-4 border-t border-rule pt-10">
          <h2 id="cursos" className="scroll-mt-24 font-serif text-2xl text-ink">
            Cursos del catálogo para esta {guide.kind === "ruta" ? "ruta" : "guía"}
          </h2>
          <p className="text-sm text-ink-muted">
            Seleccionados del catálogo en este momento según el tema de la guía y nuestra valoración editorial. Cada ficha
            indica para quién es el curso, sus requisitos y un plan de estudio.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {featured.map((course) => (
              <CourseCard key={course.slug} course={course} categorySlugs={slugsByCategory.get(course.category) ?? []} />
            ))}
          </div>
          {guide.categorySlug && (
            <Link
              href={`/${guide.categorySlug}`}
              className="w-fit text-sm text-ink underline underline-offset-4 hover:text-stamp-red"
            >
              Ver todos los cursos de {categoryName ?? "esta categoría"} →
            </Link>
          )}
        </section>
      )}

      <section aria-labelledby="more-guides" className="flex flex-col gap-4 border-t border-rule pt-10">
        <h2 id="more-guides" className="font-serif text-xl text-ink">
          Guías relacionadas
        </h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {moreGuides.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guias/${g.slug}`}
                className="group flex h-full flex-col gap-1 border border-rule bg-card p-4 transition-colors hover:border-ink"
              >
                <span className="font-mono text-[11px] text-ink-muted">{GUIDE_KIND_LABEL[g.kind]}</span>
                <span className="font-serif leading-snug text-ink group-hover:underline group-hover:decoration-rule group-hover:underline-offset-4">
                  {g.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Last thing on the page, after the article and related guides. */}
      <AdsterraNativeBanner />
    </main>
  );
}
