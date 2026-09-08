import type { Metadata } from "next";
import { readAllCourses, searchCourses } from "@/lib/courses/read";
import { logSearchQuery } from "@/lib/courses/popular-searches";
import { CourseCard } from "@/components/courses/CourseCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  const title = q ? `Buscar: ${q}` : "Buscar";
  const description = "Busca cursos gratis por título, autor o categoría.";
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  // Full catalog fetched too, only to compute a correct catalog number per
  // result (position within its OWN category, not within the search hits).
  const [results, allCourses] = await Promise.all([
    query ? searchCourses(query) : Promise.resolve([]),
    readAllCourses(),
  ]);

  // Fire-and-forget: feeds "peticiones populares" on the home page. Only
  // queries that actually found something count.
  if (results.length > 0) void logSearchQuery(query);

  const slugsByCategory = new Map<string, string[]>();
  for (const course of allCourses) {
    const list = slugsByCategory.get(course.category) ?? [];
    list.push(course.slug);
    slugsByCategory.set(course.category, list);
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-16">
      <form action="/buscar" method="get" className="flex flex-col gap-2">
        <label htmlFor="q" className="font-serif text-2xl text-ink">
          Buscar en el catálogo
        </label>
        <div className="flex gap-2">
          <input
            id="q"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="título, autor o categoría…"
            autoFocus
            className="flex-1 border border-rule bg-card px-4 py-3 text-ink placeholder:text-ink-muted"
          />
          <button
            type="submit"
            className="border-2 border-dashed border-stamp-red px-6 py-3 font-sans font-medium text-stamp-red hover:bg-stamp-red hover:text-paper"
          >
            Buscar
          </button>
        </div>
      </form>

      {query && (
        <p className="font-mono text-xs text-ink-muted">
          {results.length} resultado{results.length === 1 ? "" : "s"} para
          &ldquo;{query}&rdquo;
        </p>
      )}

      {query && results.length === 0 && (
        <p className="text-ink-muted">
          Ninguna ficha coincide con &ldquo;{query}&rdquo;.
        </p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((course) => (
            <CourseCard
              key={`${course.platform}-${course.slug}`}
              course={course}
              categorySlugs={slugsByCategory.get(course.category) ?? []}
            />
          ))}
        </div>
      )}
    </main>
  );
}
