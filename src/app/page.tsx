import Link from "next/link";
import { readAllCourses, readCategories } from "@/lib/courses/read";
import { catalogNumber } from "@/lib/courses/catalog-number";
import { CATEGORY_ICON } from "@/lib/courses/category-icons";
import { filterCourses } from "@/lib/courses/filters";
import { getPopularSearches } from "@/lib/courses/popular-searches";
import { getParamValues, clearParamsHref } from "@/lib/courses/query-params";
import { CourseCard } from "@/components/courses/CourseCard";
import { FilterPills } from "@/components/courses/FilterPills";
import { PlatformStamp } from "@/components/courses/PlatformStamp";
import { VerifiedBadge } from "@/components/courses/VerifiedBadge";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/site";

// Dynamic, not pre-rendered — see src/lib/courses/read.ts for why.
export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string | string[];
    platform?: string | string[];
    todos?: string;
  }>;
}) {
  const params = await searchParams;
  const [categories, courses, popularSearches] = await Promise.all([
    readCategories(),
    readAllCourses(),
    getPopularSearches(3),
  ]);

  const selectedCategories = getParamValues(params, "category");
  const selectedPlatforms = getParamValues(params, "platform");
  const hasFilters = selectedCategories.length > 0 || selectedPlatforms.length > 0;
  const showAll = hasFilters || params.todos === "1";

  const filtered = filterCourses(courses, {
    categories: selectedCategories,
    platforms: selectedPlatforms,
  });
  const sorted = [...filtered].sort((a, b) => (a.lastVerifiedAt < b.lastVerifiedAt ? 1 : -1));
  // Without filters, keep the front page short (latest 6) unless the
  // visitor asked to see everything via "Ver más cursos".
  const visibleCourses = showAll ? sorted : sorted.slice(0, 6);

  const heroCourse = sorted[0];
  const heroCategorySlugs = courses
    .filter((c) => c.category === heroCourse?.category)
    .map((c) => c.slug);

  const slugsByCategory = new Map<string, string[]>();
  for (const course of courses) {
    const list = slugsByCategory.get(course.category) ?? [];
    list.push(course.slug);
    slugsByCategory.set(course.category, list);
  }

  // Platform counts respect the category filter (so "YouTube (12)" means
  // "12 results if you also pick YouTube"), but not the platform filter
  // itself — a pill's own count doesn't change when you select it.
  const coursesInSelectedCategories = filterCourses(courses, {
    categories: selectedCategories,
    platforms: [],
  });
  const platformCounts = { youtube: 0, udemy: 0 };
  for (const course of coursesInSelectedCategories) {
    platformCounts[course.platform]++;
  }
  const platformOptions = [
    { value: "youtube", label: `YouTube (${platformCounts.youtube})` },
    { value: "udemy", label: `Udemy (${platformCounts.udemy})` },
  ];

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebSite", "CollectionPage"],
    name: "cursos.unaividal.com",
    url: SITE_URL,
    publisher: {
      "@type": "Person",
      name: "Unai Vidal",
      url: "https://unaividal.com",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/buscar?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: sorted.slice(0, 20).map((course, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/${course.category}/${course.slug}`,
        name: course.title,
      })),
    },
  };

  return (
    <main className="flex flex-1 flex-col">
      <JsonLd data={websiteJsonLd} />
      <section className="mx-auto grid w-full max-w-5xl gap-10 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-24">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 text-sm text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-stamp-red" />
            Índice abierto, sin paywalls
          </div>
          <h1 className="font-serif text-4xl leading-[1.15] text-ink md:text-5xl">
            Cursos gratis, catalogados por materia.
          </h1>
          <p className="max-w-md text-ink-muted">
            YouTube y Udemy, sin cuentas ni pagos — cada ficha lleva a la
            clase original, con la fecha en la que comprobamos que sigue
            siendo gratis.
          </p>
          <div className="max-w-md">
            <form action="/buscar" method="get" className="flex gap-2">
              <input
                type="search"
                name="q"
                placeholder="Python, Figma, Excel…"
                aria-label="Buscar cursos por materia"
                className="w-full border border-rule bg-card px-4 py-2.5 text-ink placeholder:text-ink-muted"
              />
              <button
                type="submit"
                className="shrink-0 border-2 border-dashed border-stamp-red px-5 py-2.5 font-sans font-medium text-stamp-red hover:bg-stamp-red hover:text-paper"
              >
                Buscar
              </button>
            </form>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-ink-muted">
              <span>peticiones populares:</span>
              {popularSearches.map((term, i) => (
                <span key={term} className="flex items-center gap-2">
                  <Link href={`/buscar?q=${encodeURIComponent(term)}`} className="text-ink underline underline-offset-2 hover:text-stamp-red">
                    {term}
                  </Link>
                  {i < popularSearches.length - 1 && <span aria-hidden="true">·</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        {heroCourse && (
          <div
            className="hero-card justify-self-center border border-rule bg-card p-6 shadow-[3px_3px_0_var(--rule)] md:-rotate-2"
            style={{ ["--settle-rotate" as string]: "-2deg" }}
          >
            <div className="flex w-64 flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-xs text-ink-muted">
                  Ficha {catalogNumber(heroCourse.category, heroCourse.slug, heroCategorySlugs)}
                </span>
                <PlatformStamp platform={heroCourse.platform} size="sm" />
              </div>
              <p className="font-serif text-lg italic leading-snug text-ink">
                {heroCourse.title}
              </p>
              <span className="font-mono text-[11px]">
                <VerifiedBadge date={heroCourse.lastVerifiedAt} />
              </span>
            </div>
          </div>
        )}
      </section>

      <section
        aria-labelledby="filters-heading"
        className="mx-auto flex w-full max-w-5xl flex-col gap-5 border-y border-rule px-6 py-6"
      >
        <h2 id="filters-heading" className="sr-only">
          Filtros
        </h2>
        <details className="filter-drawer flex flex-col gap-5">
          <summary className="text-sm text-ink-muted hover:text-ink">
            Filtrar <span className="chevron">▾</span>
          </summary>
          <FilterPills
            basePath="/"
            searchParams={params}
            paramKey="category"
            label="Categoría"
            allHref={clearParamsHref("/", params, ["category"])}
            options={categories.map((c) => ({
              value: c.slug,
              label: c.name,
              icon: CATEGORY_ICON[c.slug],
            }))}
          />
          <FilterPills
            basePath="/"
            searchParams={params}
            paramKey="platform"
            label="Plataforma"
            options={platformOptions}
          />
          {hasFilters && (
            <Link
              href={clearParamsHref("/", params, ["category", "platform"])}
              className="w-fit font-mono text-xs text-ink-muted underline hover:text-ink"
            >
              quitar filtros
            </Link>
          )}
        </details>
      </section>

      <section aria-labelledby="latest-heading" className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 id="latest-heading" className="font-serif text-2xl text-ink">
            {hasFilters ? "Resultados" : "Fichas recientes"}
          </h2>
          <span className="font-mono text-xs text-ink-muted">
            {visibleCourses.length} ficha{visibleCourses.length === 1 ? "" : "s"}
          </span>
        </div>

        {visibleCourses.length === 0 ? (
          <p className="text-ink-muted">Ningún curso coincide con estos filtros.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleCourses.map((course) => (
              <CourseCard
                key={`${course.platform}-${course.slug}`}
                course={course}
                categorySlugs={slugsByCategory.get(course.category) ?? []}
              />
            ))}
          </div>
        )}

        {!showAll && sorted.length > visibleCourses.length && (
          <div className="mt-8 flex justify-center">
            <Link
              href="/?todos=1"
              className="border border-rule px-6 py-2.5 text-sm text-ink-muted hover:border-ink hover:text-ink"
            >
              Ver más cursos ({sorted.length - visibleCourses.length} más)
            </Link>
          </div>
        )}
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-6 border border-rule bg-card p-8 md:grid-cols-[1fr_2fr]">
          <div className="flex flex-col gap-1 border-b border-rule pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-6">
            <span className="text-sm text-stamp-red">Metodología y transparencia</span>
            <h2 className="font-serif text-xl text-ink">Cómo verificamos los cursos</h2>
          </div>
          <div className="flex flex-col gap-3 text-ink-muted">
            <p>
              <strong className="font-medium text-ink">
                cursos.unaividal.com — enlazamos a YouTube y Udemy, no alojamos contenido.
              </strong>
            </p>
            <p>
              Cada ficha muestra la fecha exacta en que se comprobó a mano que el curso seguía
              siendo gratis. Un curso que deja de serlo se retira del catálogo en vez de quedar
              publicado con una etiqueta desactualizada.
            </p>
            <Link
              href="/como-verificamos"
              className="w-fit text-sm text-ink underline underline-offset-4 hover:text-stamp-red"
            >
              Leer la guía completa del proceso →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
