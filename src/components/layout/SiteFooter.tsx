import Link from "next/link";
import { readCategories } from "@/lib/courses/read";

export async function SiteFooter() {
  // The footer's category nav is a nice-to-have, not core content — a DB
  // hiccup here (or a build-time render of a route with no page-level
  // data, like the built-in /_not-found) must not take the whole page
  // down with it.
  const categories = await readCategories().catch(() => []);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
        <nav aria-label="Categorías" className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {categories.map((category) => (
            <Link key={category.slug} href={`/${category.slug}`} className="text-ink-muted hover:text-ink">
              {category.name}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-4 border-t border-rule pt-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-serif text-lg font-bold tracking-tight text-ink">cursos.</span>
            <p className="max-w-sm font-mono text-xs text-ink-muted">
              © {year} cursos.unaividal.com — catálogo curado y verificado por Unai Vidal.
              Enlazamos a YouTube y Udemy, no alojamos contenido.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
            <Link href="/como-verificamos" className="hover:text-ink hover:underline underline-offset-4">
              Cómo verificamos
            </Link>
            <Link href="/privacidad" className="hover:text-ink hover:underline underline-offset-4">
              Privacidad
            </Link>
            <a
              href="https://unaividal.com"
              rel="author"
              className="hover:text-ink hover:underline underline-offset-4"
            >
              unaividal.com
            </a>
            <a
              href="https://github.com/unaivv/cursos-gratis"
              rel="noopener noreferrer"
              target="_blank"
              className="hover:text-ink hover:underline underline-offset-4"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
