import type { Metadata } from "next";
import Link from "next/link";

// The layout's SiteFooter reads categories from the DB — see como-verificamos.
export const dynamic = "force-dynamic";

const TITLE = "Contacto";
const DESCRIPTION =
  "Cómo ponerte en contacto con quien mantiene cursos.unaividal.com: sugerencias, correcciones y dudas.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/contacto" },
  openGraph: { title: TITLE, description: DESCRIPTION },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const linkClass = "text-ink underline underline-offset-4 hover:text-stamp-red";

export default function ContactPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-16">
      <div className="flex flex-col gap-3">
        <Link href="/" className="w-fit font-mono text-xs text-ink-muted hover:text-ink">
          ← inicio
        </Link>
        <h1 className="font-serif text-3xl text-ink">{TITLE}</h1>
        <p className="text-ink-muted">
          cursos.unaividal.com lo mantiene una sola persona, Unai Vidal. Estas son las vías para
          escribirle, según lo que necesites.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-serif text-xl text-ink">Sugerir un curso</h2>
        <p className="text-ink-muted">
          Si conoces un curso completo y gratuito que debería estar en el catálogo, usa el{" "}
          <Link href="/sugerir" className={linkClass}>
            formulario de sugerencias
          </Link>
          . Cada propuesta se revisa a mano antes de publicarse.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-serif text-xl text-ink">Avisar de un error</h2>
        <p className="text-ink-muted">
          Un curso que ya no es gratis, un enlace roto o un dato incorrecto: abre una incidencia en{" "}
          <a
            href="https://github.com/unaivv/cursos-gratis/issues"
            rel="noopener noreferrer"
            target="_blank"
            className={linkClass}
          >
            el repositorio de GitHub
          </a>{" "}
          o indícalo a través del formulario de sugerencias, y lo revisaremos.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-serif text-xl text-ink">Otros asuntos</h2>
        <p className="text-ink-muted">
          Para cualquier otra consulta (colaboraciones, dudas sobre privacidad o sobre el proyecto),
          puedes contactar a través de{" "}
          <a href="https://unaividal.com" rel="author" className={linkClass}>
            unaividal.com
          </a>
          . Más información sobre el proyecto en{" "}
          <Link href="/sobre-el-proyecto" className={linkClass}>
            Sobre el proyecto
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
