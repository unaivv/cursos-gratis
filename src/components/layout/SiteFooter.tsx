import Link from "next/link";
import { readCategories } from "@/lib/courses/read";
import { guidesByKind } from "@/lib/editorial/guides";

export async function SiteFooter() {
  // The footer's category nav is a nice-to-have, not core content — a DB
  // hiccup here (or a build-time render of a route with no page-level
  // data, like the built-in /_not-found) must not take the whole page
  // down with it.
  const categories = await readCategories().catch(() => []);
  const year = new Date().getFullYear();
  const paths = guidesByKind("ruta").slice(0, 8);
  const method = guidesByKind("metodo").slice(0, 6);

  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <nav aria-labelledby="footer-categories" className="flex flex-col gap-2 text-sm">
            <h2 id="footer-categories" className="font-mono text-[11px] uppercase tracking-wide text-ink-muted">
              Materias
            </h2>
            <ul className="flex flex-col gap-1">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link href={`/${category.slug}`} className="text-ink-muted hover:text-ink">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-labelledby="footer-paths" className="flex flex-col gap-2 text-sm">
            <h2 id="footer-paths" className="font-mono text-[11px] uppercase tracking-wide text-ink-muted">
              Rutas de aprendizaje
            </h2>
            <ul className="flex flex-col gap-1">
              {paths.map((guide) => (
                <li key={guide.slug}>
                  <Link href={`/guias/${guide.slug}`} className="text-ink-muted hover:text-ink">
                    {guide.shortTitle}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/guias#rutas" className="text-ink hover:underline underline-offset-4">
                  Todas las rutas →
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-labelledby="footer-method" className="flex flex-col gap-2 text-sm">
            <h2 id="footer-method" className="font-mono text-[11px] uppercase tracking-wide text-ink-muted">
              Aprender mejor
            </h2>
            <ul className="flex flex-col gap-1">
              {method.map((guide) => (
                <li key={guide.slug}>
                  <Link href={`/guias/${guide.slug}`} className="text-ink-muted hover:text-ink">
                    {guide.shortTitle}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/guias" className="text-ink hover:underline underline-offset-4">
                  Todas las guías →
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-rule pt-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-serif text-lg font-bold tracking-tight text-ink">cursos.</span>
            <p className="max-w-sm font-mono text-xs text-ink-muted">
              © {year} cursosgratis.pro — catálogo curado y verificado por Unai Vidal.
              Enlazamos a YouTube y Udemy, no alojamos contenido.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
            <Link href="/guias" className="hover:text-ink hover:underline underline-offset-4">
              Guías
            </Link>
            <Link href="/como-verificamos" className="hover:text-ink hover:underline underline-offset-4">
              Cómo verificamos
            </Link>
            <Link href="/sobre-el-proyecto" className="hover:text-ink hover:underline underline-offset-4">
              Sobre el proyecto
            </Link>
            <Link href="/contacto" className="hover:text-ink hover:underline underline-offset-4">
              Contacto
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
