import type { Metadata } from "next";
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
import { AdSlot } from "@/components/ads/AdSlot";
import { VerdictBadge } from "@/components/courses/VerdictBadge";
import { GUIDES, guidesByKind, readingMinutes } from "@/lib/editorial/guides";
import { CATEGORY_EDITORIAL } from "@/lib/editorial/categories";
import { recommendationRank } from "@/lib/courses/ai-analysis";
import type { CourseRecord } from "@/lib/courses/schema";
import { SITE_URL } from "@/lib/site";

/** Highest editorial verdicts, at most `perCategory` per category so one subject can't fill the block. */
function mostRecommended(courses: CourseRecord[], limit: number, perCategory = 2): CourseRecord[] {
  const perCategoryCount = new Map<string, number>();
  const picked: CourseRecord[] = [];
  const ranked = courses
    .filter((course) => course.aiAnalysis)
    .sort((a, b) => recommendationRank(b.aiAnalysis) - recommendationRank(a.aiAnalysis));
  for (const course of ranked) {
    const count = perCategoryCount.get(course.category) ?? 0;
    if (count >= perCategory) continue;
    perCategoryCount.set(course.category, count + 1);
    picked.push(course);
    if (picked.length === limit) break;
  }
  return picked;
}

const STEPS = [
  {
    title: "Seleccionamos",
    text: "Cursos completos de canales y plataformas educativas. Cada vídeo nuevo pasa un filtro que descarta noticias, opiniones, clips y promociones antes de que una persona lo revise.",
  },
  {
    title: "Comprobamos que es gratis",
    text: "Cada ficha lleva la fecha en la que se verificó que el curso sigue siendo gratuito. Si deja de serlo, se retira del catálogo en lugar de quedarse con una etiqueta falsa.",
  },
  {
    title: "Lo analizamos",
    text: "Para quién es, qué necesitas saber antes, cómo está estructurado, puntos fuertes y débiles, un plan de estudio y un veredicto, siempre a partir de los datos publicados del curso.",
  },
];

// Dynamic, not pre-rendered — see src/lib/courses/read.ts for why.
export const dynamic = "force-dynamic";

// Title/description/OG come from the root layout's defaults; the canonical
// folds the filtered variants (?category=, ?platform=, ?todos=) into "/".
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

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

  const recommended = mostRecommended(courses, 6);
  const heroCourse = recommended[0] ?? sorted[0];
  const analyzedCount = courses.filter((course) => course.aiAnalysis).length;
  const paths = guidesByKind("ruta");
  const methodGuides = [...guidesByKind("metodo"), ...guidesByKind("eleccion")];
  const categoryCounts = new Map<string, number>();
  for (const course of courses) categoryCounts.set(course.category, (categoryCounts.get(course.category) ?? 0) + 1);
  const categoryNames = new Map(categories.map((c) => [c.slug, c.name]));
  const populatedCategories = categories
    .filter((c) => (categoryCounts.get(c.slug) ?? 0) > 0)
    .sort((a, b) => (categoryCounts.get(b.slug) ?? 0) - (categoryCounts.get(a.slug) ?? 0));
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
    inLanguage: "es",
    description:
      "Catálogo de cursos gratuitos de YouTube y Udemy analizados y verificados, con rutas de aprendizaje y guías de estudio.",
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
            Cursos gratis, analizados y ordenados en rutas.
          </h1>
          <p className="max-w-md text-ink-muted">
            Elegimos cursos completos de YouTube y Udemy, comprobamos que siguen siendo gratis y
            te contamos para quién es cada uno, qué aprenderás y cómo seguirlo hasta el final. Con
            rutas de aprendizaje para saber por dónde empezar.
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
          <dl className="grid max-w-md grid-cols-3 gap-4 border-t border-rule pt-4">
            {[
              { value: courses.length, label: "cursos verificados" },
              { value: analyzedCount, label: "con análisis editorial" },
              { value: GUIDES.length, label: "guías y rutas" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse">
                <dt className="font-mono text-[11px] text-ink-muted">{stat.label}</dt>
                <dd className="font-serif text-2xl text-ink">{stat.value}</dd>
              </div>
            ))}
          </dl>
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
              <Link
                href={`/${heroCourse.category}/${heroCourse.slug}`}
                className="font-serif text-lg italic leading-snug text-ink hover:underline hover:decoration-rule hover:underline-offset-4"
              >
                {heroCourse.title}
              </Link>
              {heroCourse.aiAnalysis && <VerdictBadge verdict={heroCourse.aiAnalysis.verdict} />}
              <span className="font-mono text-[11px]">
                <VerifiedBadge date={heroCourse.lastVerifiedAt} />
              </span>
            </div>
          </div>
        )}
      </section>

      <div className="mx-auto w-full max-w-5xl px-6">
        <AdSlot slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME} />
      </div>

      {!showAll && (
        <>
          <section aria-labelledby="paths-heading" className="mx-auto w-full max-w-5xl px-6 py-12">
            <div className="mb-2 flex items-baseline justify-between gap-4">
              <h2 id="paths-heading" className="font-serif text-2xl text-ink">
                Rutas de aprendizaje
              </h2>
              <Link href="/guias#rutas" className="shrink-0 text-sm text-ink-muted underline underline-offset-4 hover:text-ink">
                Todas las rutas ({paths.length}) →
              </Link>
            </div>
            <p className="mb-6 max-w-2xl text-ink-muted">
              ¿No sabes por dónde empezar? Cada ruta ordena una materia por etapas, con cuánto tiempo
              dedicar, qué practicar y los cursos del catálogo que encajan en cada paso.
            </p>
            <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {paths.slice(0, 8).map((guide, index) => {
                const Icon = guide.categorySlug ? CATEGORY_ICON[guide.categorySlug] : undefined;
                return (
                  <li key={guide.slug}>
                    <Link
                      href={`/guias/${guide.slug}`}
                      className="group flex h-full flex-col gap-3 border border-rule bg-card p-5 transition-colors hover:border-ink"
                    >
                      <span className="flex items-center justify-between font-mono text-[11px] text-ink-muted">
                        <span>Ruta {String(index + 1).padStart(2, "0")}</span>
                        {Icon && <Icon size={16} strokeWidth={1.5} aria-hidden="true" />}
                      </span>
                      <span className="font-serif text-lg leading-snug text-ink group-hover:underline group-hover:decoration-rule group-hover:underline-offset-4">
                        {guide.title}
                      </span>
                      <span className="mt-auto font-mono text-[11px] text-ink-muted">
                        {guide.categorySlug ? categoryNames.get(guide.categorySlug) ?? "" : ""} · {readingMinutes(guide)} min
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>

          {recommended.length > 0 && (
            <section aria-labelledby="recommended-heading" className="mx-auto w-full max-w-5xl px-6 pb-12">
              <div className="mb-2 flex items-baseline justify-between gap-4">
                <h2 id="recommended-heading" className="font-serif text-2xl text-ink">
                  Los más recomendados
                </h2>
                <Link href="/como-verificamos#analisis" className="shrink-0 text-sm text-ink-muted underline underline-offset-4 hover:text-ink">
                  Cómo los valoramos →
                </Link>
              </div>
              <p className="mb-6 max-w-2xl text-ink-muted">
                Los cursos mejor valorados en nuestro análisis editorial: completos, bien estructurados
                y actuales para su tema. Cada ficha explica por qué.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recommended.map((course) => (
                  <CourseCard
                    key={`rec-${course.slug}`}
                    course={course}
                    categorySlugs={slugsByCategory.get(course.category) ?? []}
                  />
                ))}
              </div>
            </section>
          )}

          <section aria-labelledby="categories-heading" className="mx-auto w-full max-w-5xl px-6 pb-12">
            <h2 id="categories-heading" className="mb-6 font-serif text-2xl text-ink">
              Explora por materia
            </h2>
            <ul className="grid grid-cols-1 gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
              {populatedCategories.map((category) => {
                const Icon = CATEGORY_ICON[category.slug];
                const count = categoryCounts.get(category.slug) ?? 0;
                return (
                  <li key={category.slug} className="bg-card">
                    <Link href={`/${category.slug}`} className="group flex h-full gap-4 p-5 hover:bg-paper">
                      {Icon && <Icon size={22} strokeWidth={1.5} aria-hidden="true" className="mt-0.5 shrink-0 text-ink-muted" />}
                      <span className="flex flex-col gap-1">
                        <span className="flex items-baseline gap-2">
                          <span className="font-serif text-lg text-ink group-hover:underline group-hover:decoration-rule group-hover:underline-offset-4">
                            {category.name}
                          </span>
                          <span className="font-mono text-[11px] text-ink-muted">
                            {count} curso{count === 1 ? "" : "s"}
                          </span>
                        </span>
                        {CATEGORY_EDITORIAL[category.slug] && (
                          <span className="text-sm text-ink-muted">{CATEGORY_EDITORIAL[category.slug].tagline}</span>
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          <section aria-labelledby="method-heading" className="mx-auto w-full max-w-5xl px-6 pb-12">
            <div className="mb-2 flex items-baseline justify-between gap-4">
              <h2 id="method-heading" className="font-serif text-2xl text-ink">
                Aprende a aprender
              </h2>
              <Link href="/guias#metodo" className="shrink-0 text-sm text-ink-muted underline underline-offset-4 hover:text-ink">
                Todas las guías →
              </Link>
            </div>
            <p className="mb-6 max-w-2xl text-ink-muted">
              Un curso gratis no tiene profesor ni fechas: estas guías ponen la estructura que falta,
              desde elegir bien hasta demostrar lo aprendido.
            </p>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
              {methodGuides.slice(0, 8).map((guide) => (
                <li key={guide.slug} className="border-b border-rule pb-4">
                  <Link href={`/guias/${guide.slug}`} className="group flex flex-col gap-1">
                    <span className="font-serif text-lg leading-snug text-ink group-hover:underline group-hover:decoration-rule group-hover:underline-offset-4">
                      {guide.title}
                    </span>
                    <span className="text-sm text-ink-muted">{guide.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

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
            {hasFilters ? "Resultados" : showAll ? "Todas las fichas" : "Añadidos recientemente"}
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

      <section aria-labelledby="how-heading" className="mx-auto w-full max-w-5xl px-6 pb-16">
        <div className="flex flex-col gap-6 border border-rule bg-card p-8">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-stamp-red">Metodología y transparencia</span>
            <h2 id="how-heading" className="font-serif text-2xl text-ink">
              Cómo elegimos, verificamos y analizamos
            </h2>
          </div>
          <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex flex-col gap-2">
                <span className="font-mono text-sm text-stamp-red">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="font-serif text-lg text-ink">{step.title}</h3>
                <p className="text-sm text-ink-muted">{step.text}</p>
              </li>
            ))}
          </ol>
          <p className="text-sm text-ink-muted">
            <strong className="font-medium text-ink">
              Enlazamos a YouTube y Udemy, no alojamos contenido ni cobramos comisión.
            </strong>{" "}
            <Link href="/como-verificamos" className="text-ink underline underline-offset-4 hover:text-stamp-red">
              Leer el proceso completo →
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
