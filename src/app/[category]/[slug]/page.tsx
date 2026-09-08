import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseBySlug, getCoursesByCategory, readCategories } from "@/lib/courses/read";
import { catalogNumber } from "@/lib/courses/catalog-number";
import { courseBlurb } from "@/lib/courses/blurb";
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
  const description = courseBlurb(course, categoryName);
  return {
    title: course.title,
    description,
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

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: blurb,
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
    </main>
  );
}
