import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/editorial/guides";

// The layout's SiteFooter reads categories from the DB — see como-verificamos.
export const dynamic = "force-dynamic";

const TITLE = "Guías para aprender gratis";
const DESCRIPTION =
  "Hojas de ruta y consejos para aprender programación, datos, diseño o idiomas con cursos gratuitos de YouTube y Udemy.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
  twitter: { title: TITLE, description: DESCRIPTION },
};

export default function GuidesIndexPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
      <div className="flex flex-col gap-3">
        <Link href="/" className="w-fit font-mono text-xs text-ink-muted hover:text-ink">
          ← inicio
        </Link>
        <h1 className="font-serif text-3xl text-ink">{TITLE}</h1>
        <p className="text-ink-muted">
          Un catálogo de cursos responde a «qué hay»; estas guías responden a «por dónde empiezo»
          y «cómo llego hasta el final». Cada una propone un orden, explica qué esperar de cada
          etapa y enlaza con los cursos del catálogo que encajan.
        </p>
      </div>

      <ul className="flex flex-col gap-4">
        {GUIDES.map((guide) => (
          <li key={guide.slug}>
            <Link
              href={`/guias/${guide.slug}`}
              className="group flex flex-col gap-2 border border-rule bg-card p-6 transition-colors hover:border-ink"
            >
              <h2 className="font-serif text-xl leading-snug text-ink group-hover:underline group-hover:decoration-rule group-hover:underline-offset-4">
                {guide.title}
              </h2>
              <p className="text-sm text-ink-muted">{guide.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
