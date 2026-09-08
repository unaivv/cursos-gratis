import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCoursesByCategory, readCategories } from "@/lib/courses/read";
import { CATEGORY_ICON } from "@/lib/courses/category-icons";
import { filterCourses } from "@/lib/courses/filters";
import { getParamValues, clearParamsHref } from "@/lib/courses/query-params";
import { CourseCard } from "@/components/courses/CourseCard";
import { FilterPills } from "@/components/courses/FilterPills";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/site";

// Dynamic, not pre-rendered — see src/lib/courses/read.ts for why.
export const dynamic = "force-dynamic";

async function findCategory(slug: string) {
  const categories = await readCategories();
  return categories.find((category) => category.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await findCategory(categorySlug);
  if (!category) return {};
  const title = `Cursos gratis de ${category.name}, verificados`;
  const description = `Cursos gratuitos de ${category.name} en YouTube y Udemy, verificados a mano — con la fecha de cada comprobación.`;
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ platform?: string | string[] }>;
}) {
  const { category: categorySlug } = await params;
  const search = await searchParams;
  const category = await findCategory(categorySlug);
  if (!category) notFound();

  const allInCategory = await getCoursesByCategory(categorySlug);
  const categorySlugs = allInCategory.map((c) => c.slug);
  const selectedPlatforms = getParamValues(search, "platform");
  const courses = filterCourses(allInCategory, { categories: [], platforms: selectedPlatforms });

  const platformCounts = { youtube: 0, udemy: 0 };
  for (const course of allInCategory) platformCounts[course.platform]++;
  const platformOptions = [
    { value: "youtube", label: `YouTube (${platformCounts.youtube})` },
    { value: "udemy", label: `Udemy (${platformCounts.udemy})` },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: category.name, item: `${SITE_URL}/${category.slug}` },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Cursos gratis de ${category.name}`,
    url: `${SITE_URL}/${category.slug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: allInCategory.map((course, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/${course.category}/${course.slug}`,
        name: course.title,
      })),
    },
  };

  return (
    <main className="flex flex-1 flex-col">
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={collectionJsonLd} />
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-5 border-b border-rule px-6 py-6">
        <Link href="/" className="w-fit font-mono text-xs text-ink-muted hover:text-ink">
          ← todas las categorías
        </Link>
        <details className="filter-drawer flex flex-col gap-5">
          <summary className="text-sm text-ink-muted hover:text-ink">
            Filtrar <span className="chevron">▾</span>
          </summary>
          <FilterPills
            basePath={`/${category.slug}`}
            searchParams={search}
            paramKey="platform"
            label="Plataforma"
            options={platformOptions}
          />
          {selectedPlatforms.length > 0 && (
            <Link
              href={clearParamsHref(`/${category.slug}`, search, ["platform"])}
              className="w-fit font-mono text-xs text-ink-muted underline hover:text-ink"
            >
              quitar filtro
            </Link>
          )}
        </details>
      </section>

      <section className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <h1 className="mb-8 flex items-center gap-3 font-serif text-3xl text-ink">
          {(() => {
            const Icon = CATEGORY_ICON[category.slug];
            return Icon ? <Icon size={28} strokeWidth={1.5} aria-hidden="true" /> : null;
          })()}
          {category.name}
        </h1>

        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="font-serif text-2xl text-ink">Fichas verificadas</h2>
          <span className="font-mono text-xs text-ink-muted">
            {courses.length} ficha{courses.length === 1 ? "" : "s"}
          </span>
        </div>

        {courses.length === 0 ? (
          <p className="text-ink-muted">
            {selectedPlatforms.length > 0
              ? "Ningún curso de esta categoría coincide con ese filtro."
              : "Todavía no hay fichas en esta categoría."}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={`${course.platform}-${course.slug}`}
                course={course}
                categorySlugs={categorySlugs}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
