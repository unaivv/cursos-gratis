import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { getCoursesByCategory, readCategories } from "@/lib/courses/read";
import { CATEGORY_ICON } from "@/lib/courses/category-icons";
import { filterCourses } from "@/lib/courses/filters";
import { getParamValues, clearParamsHref } from "@/lib/courses/query-params";
import { PAGE_PARAM, pageCount, pageHref, pageSlice, parsePageParam, COURSES_PER_PAGE } from "@/lib/courses/pagination";
import { catalogNumbers } from "@/lib/courses/catalog-number";
import { CATEGORY_EDITORIAL } from "@/lib/editorial/categories";
import { GUIDE_KIND_LABEL, guideForCategory, guidesForCategory } from "@/lib/editorial/guides";
import { recommendationRank } from "@/lib/courses/ai-analysis";
import { buildCategoryFaq, faqAnswerText } from "@/lib/courses/category-faq";
import { CourseCard } from "@/components/courses/CourseCard";
import { FilterPills } from "@/components/courses/FilterPills";
import { CategoryFaqSection } from "@/components/courses/CategoryFaqSection";
import { Pagination } from "@/components/layout/Pagination";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdsterraBand, AdsterraLeaderboard } from "@/components/ads/AdsterraBanner";
import { AdsterraNativeBanner } from "@/components/ads/AdsterraNativeBanner";
import { IN_FEED_AD_EVERY } from "@/components/ads/adsterra";
import { interleaveAds } from "@/components/ads/interleave";
import { SITE_URL } from "@/lib/site";

// Dynamic, not pre-rendered — see src/lib/courses/read.ts for why.
export const dynamic = "force-dynamic";

async function findCategory(slug: string) {
  const categories = await readCategories();
  return categories.find((category) => category.slug === slug);
}

type CategorySearchParams = { platform?: string | string[]; page?: string | string[] };

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<CategorySearchParams>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const search = await searchParams;
  const category = await findCategory(categorySlug);
  if (!category) return {};
  // An invalid page 404s in the page itself; metadata just falls back to page 1.
  const page = parsePageParam(search[PAGE_PARAM]) ?? 1;
  const pageSuffix = page > 1 ? ` — página ${page}` : "";
  const title = `Cursos gratis de ${category.name}: rutas, análisis y selección verificada${pageSuffix}`;
  const tagline = CATEGORY_EDITORIAL[category.slug]?.tagline;
  const description = `Cursos gratuitos de ${category.name} en YouTube y Udemy, analizados y verificados a mano${
    tagline ? `: ${tagline.charAt(0).toLowerCase()}${tagline.slice(1)}` : "."
  }${pageSuffix}`;
  // Each unfiltered page is its own canonical; filtered views (nofollow,
  // disallowed in robots) canonicalize to the plain category.
  const filtered = getParamValues(search, "platform").length > 0;
  const canonical = filtered ? `/${category.slug}` : pageHref(`/${category.slug}`, {}, page);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<CategorySearchParams>;
}) {
  const { category: categorySlug } = await params;
  const search = await searchParams;
  const category = await findCategory(categorySlug);
  if (!category) notFound();

  const basePath = `/${category.slug}`;
  const page = parsePageParam(search[PAGE_PARAM]);
  if (page === null) notFound();
  // `?page=1` would duplicate the bare URL — send it there for good.
  if (search[PAGE_PARAM] !== undefined && page === 1) permanentRedirect(pageHref(basePath, search, 1));

  const allInCategory = await getCoursesByCategory(categorySlug);
  const numbers = catalogNumbers(category.slug, allInCategory.map((c) => c.slug));
  const selectedPlatforms = getParamValues(search, "platform");
  const courses = filterCourses(allInCategory, { categories: [], platforms: selectedPlatforms });
  const totalPages = pageCount(courses.length);
  if (page > totalPages) notFound();
  // The editorial blocks (intro, guides, top picks, tips, FAQ) live on
  // page 1 only, so later pages aren't near-duplicates of it.
  const isFirstPage = page === 1;

  const editorial = CATEGORY_EDITORIAL[category.slug];
  const guides = guidesForCategory(category.slug);
  const topCourses = allInCategory
    .filter((course) => course.aiAnalysis)
    .sort((a, b) => recommendationRank(b.aiAnalysis) - recommendationRank(a.aiAnalysis))
    .slice(0, 3);
  // Best-rated first, then the rest in catalog order.
  const sortedCourses = [...courses].sort((a, b) => recommendationRank(b.aiAnalysis) - recommendationRank(a.aiAnalysis));
  const pageCourses = pageSlice(sortedCourses, page);
  const pageOffset = (page - 1) * COURSES_PER_PAGE;

  // Generated from the whole category (never the filtered list), so the
  // visible FAQ and its JSON-LD stay the same whatever the filter.
  const startGuide = guideForCategory(category.slug);
  const faq = buildCategoryFaq({
    categoryName: category.name,
    courses: allInCategory,
    startGuide: startGuide?.kind === "ruta" ? startGuide : undefined,
  });

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
    url: `${SITE_URL}${pageHref(basePath, {}, page)}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: courses.length,
      itemListElement: pageCourses.map((course, index) => ({
        "@type": "ListItem",
        position: pageOffset + index + 1,
        url: `${SITE_URL}/${course.category}/${course.slug}`,
        name: course.title,
      })),
    },
  };

  const faqJsonLd = isFirstPage && faq.length > 0 && {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: faqAnswerText(item.answer) },
    })),
  };

  return (
    <main className="flex flex-1 flex-col">
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={collectionJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-5 border-b border-rule px-6 py-6">
        <Link href="/" className="w-fit font-mono text-xs text-ink-muted hover:text-ink">
          ← todas las categorías
        </Link>
        <details className="filter-drawer flex flex-col gap-5">
          <summary className="text-sm text-ink-muted hover:text-ink">
            Filtrar <span className="chevron">▾</span>
          </summary>
          <FilterPills
            basePath={basePath}
            // Changing the filter starts over from page 1.
            searchParams={{ platform: search.platform }}
            paramKey="platform"
            label="Plataforma"
            options={platformOptions}
          />
          {selectedPlatforms.length > 0 && (
            <Link
              href={clearParamsHref(basePath, search, ["platform", PAGE_PARAM])}
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

        {isFirstPage && editorial && (
          <div className="mb-10 flex max-w-2xl flex-col gap-4 text-ink-muted">
            {editorial.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        )}

        {isFirstPage && guides.length > 0 && (
          <section aria-labelledby="category-guides" className="mb-12 flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="category-guides" className="font-serif text-2xl text-ink">
                Rutas y guías de {category.name}
              </h2>
              <Link href="/guias" className="shrink-0 text-sm text-ink-muted underline underline-offset-4 hover:text-ink">
                Todas las guías →
              </Link>
            </div>
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {guides.slice(0, 3).map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/guias/${g.slug}`}
                    className="group flex h-full flex-col gap-2 border border-rule bg-card p-5 transition-colors hover:border-ink"
                  >
                    <span className="font-mono text-[11px] text-stamp-red">{GUIDE_KIND_LABEL[g.kind]}</span>
                    <span className="font-serif text-lg leading-snug text-ink group-hover:underline group-hover:decoration-rule group-hover:underline-offset-4">
                      {g.title}
                    </span>
                    <span className="text-sm text-ink-muted">{g.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {isFirstPage && topCourses.length > 0 && selectedPlatforms.length === 0 && (
          <section aria-labelledby="top-courses" className="mb-12 flex flex-col gap-4">
            <h2 id="top-courses" className="font-serif text-2xl text-ink">
              Los más recomendados
            </h2>
            <p className="max-w-2xl text-sm text-ink-muted">
              Según nuestro análisis editorial de cada curso: estructura, profundidad para su duración y actualidad.{" "}
              <Link href="/como-verificamos#analisis" className="text-ink underline underline-offset-4 hover:text-stamp-red">
                Cómo lo hacemos
              </Link>
              .
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topCourses.map((course) => (
                <CourseCard key={`top-${course.slug}`} course={course} number={numbers.get(course.slug)} />
              ))}
            </div>
          </section>
        )}

        <AdsterraLeaderboard className="mb-8" />

        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="font-serif text-2xl text-ink">Todas las fichas</h2>
          <span className="font-mono text-xs text-ink-muted">
            {courses.length} ficha{courses.length === 1 ? "" : "s"}
            {totalPages > 1 && ` · página ${page} de ${totalPages}`}
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
            {interleaveAds(pageCourses, IN_FEED_AD_EVERY).map((entry) =>
              entry.type === "ad" ? (
                <AdsterraLeaderboard key={`ad-${entry.slot}`} className="col-span-full" />
              ) : (
                <CourseCard
                  key={`${entry.item.platform}-${entry.item.slug}`}
                  course={entry.item}
                  number={numbers.get(entry.item.slug)}
                />
              )
            )}
          </div>
        )}

        <Pagination
          basePath={basePath}
          searchParams={search}
          current={page}
          total={totalPages}
          nofollow={selectedPlatforms.length > 0}
        />

        {courses.length > 0 && <AdsterraLeaderboard className="mt-8" />}
      </section>

      {isFirstPage && editorial && (
        <section
          aria-labelledby="how-to-learn"
          className="mx-auto w-full max-w-5xl border-t border-rule px-6 py-12"
        >
          <div className="flex max-w-2xl flex-col gap-4">
            <h2 id="how-to-learn" className="font-serif text-2xl text-ink">
              Cómo sacarle partido a estos cursos
            </h2>
            <ul className="flex list-disc flex-col gap-2 pl-5 text-ink-muted">
              {editorial.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
            <p className="text-ink-muted">
              Para cualquier curso de esta lista, estas guías te ayudan a llegar al final:{" "}
              <Link
                href="/guias/seguir-un-curso-de-youtube-hasta-el-final"
                className="text-ink underline underline-offset-4 hover:text-stamp-red"
              >
                cómo seguir un curso de YouTube hasta el final
              </Link>{" "}
              y{" "}
              <Link href="/guias/plan-de-estudio-semanal" className="text-ink underline underline-offset-4 hover:text-stamp-red">
                cómo montar tu plan de estudio semanal
              </Link>
              .
            </p>
          </div>
        </section>
      )}

      {isFirstPage && faq.length > 0 && (
        <section className="mx-auto w-full max-w-5xl border-t border-rule px-6 py-12">
          <CategoryFaqSection items={faq} />
        </section>
      )}

      <AdsterraBand className="mx-auto w-full max-w-5xl px-6 pb-12">
        <AdsterraNativeBanner />
      </AdsterraBand>
    </main>
  );
}
