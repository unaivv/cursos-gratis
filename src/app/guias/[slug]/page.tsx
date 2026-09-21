import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, GUIDES } from "@/lib/editorial/guides";
import { getCoursesByCategory, readCategories } from "@/lib/courses/read";
import { CourseCard } from "@/components/courses/CourseCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/site";

// Dynamic for the same reason as every other page — see src/lib/courses/read.ts.
export const dynamic = "force-dynamic";

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
    openGraph: { type: "article", title: guide.title, description: guide.description },
    twitter: { title: guide.title, description: guide.description },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const [categoryCourses, categories] = guide.categorySlug
    ? await Promise.all([getCoursesByCategory(guide.categorySlug), readCategories()])
    : [[], []];
  const categoryName = categories.find((c) => c.slug === guide.categorySlug)?.name;
  const categorySlugs = categoryCourses.map((c) => c.slug);
  const featured = categoryCourses.slice(0, 6);
  const otherGuides = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    dateModified: guide.updated,
    inLanguage: "es",
    mainEntityOfPage: `${SITE_URL}/guias/${guide.slug}`,
    author: { "@type": "Person", name: "Unai Vidal", url: "https://unaividal.com" },
    publisher: { "@type": "Person", name: "Unai Vidal", url: "https://unaividal.com" },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Guías", item: `${SITE_URL}/guias` },
      { "@type": "ListItem", position: 3, name: guide.title, item: `${SITE_URL}/guias/${guide.slug}` },
    ],
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-16">
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <div className="flex flex-col gap-4">
        <Link href="/guias" className="w-fit font-mono text-xs text-ink-muted hover:text-ink">
          ← todas las guías
        </Link>
        <h1 className="font-serif text-3xl leading-tight text-ink">{guide.title}</h1>
        <p className="font-mono text-xs text-ink-muted">
          Por Unai Vidal · actualizada el {guide.updated}
        </p>
        <p className="text-lg text-ink-muted">{guide.intro}</p>
      </div>

      {guide.sections.map((section) => (
        <section key={section.heading} className="flex flex-col gap-4">
          <h2 className="font-serif text-2xl text-ink">{section.heading}</h2>
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="text-ink-muted">
              {paragraph}
            </p>
          ))}
          {section.steps && (
            <ul className="flex list-disc flex-col gap-2 pl-5 text-ink-muted">
              {section.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {featured.length > 0 && guide.categorySlug && (
        <section aria-labelledby="guide-courses" className="flex flex-col gap-4 border-t border-rule pt-10">
          <h2 id="guide-courses" className="font-serif text-2xl text-ink">
            Cursos del catálogo para empezar
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {featured.map((course) => (
              <CourseCard key={course.slug} course={course} categorySlugs={categorySlugs} />
            ))}
          </div>
          <Link
            href={`/${guide.categorySlug}`}
            className="w-fit text-sm text-ink underline underline-offset-4 hover:text-stamp-red"
          >
            Ver todos los cursos de {categoryName ?? "esta categoría"} →
          </Link>
        </section>
      )}

      <section aria-labelledby="more-guides" className="flex flex-col gap-3 border-t border-rule pt-10">
        <h2 id="more-guides" className="font-serif text-xl text-ink">
          Otras guías
        </h2>
        <ul className="flex flex-col gap-2">
          {otherGuides.map((g) => (
            <li key={g.slug}>
              <Link href={`/guias/${g.slug}`} className="text-ink underline underline-offset-4 hover:text-stamp-red">
                {g.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
