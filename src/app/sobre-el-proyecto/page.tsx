import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/site";

// The layout's SiteFooter reads categories from the DB — see como-verificamos.
export const dynamic = "force-dynamic";

const TITLE = "Sobre el proyecto";
const DESCRIPTION =
  "Quién mantiene cursos.unaividal.com, por qué existe, cómo se elige lo que se publica y cómo se financia.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: TITLE,
  url: `${SITE_URL}/sobre-el-proyecto`,
  about: {
    "@type": "WebSite",
    name: "cursos.unaividal.com",
    url: SITE_URL,
    author: { "@type": "Person", name: "Unai Vidal", url: "https://unaividal.com" },
  },
};

export default function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-16">
      <JsonLd data={aboutJsonLd} />

      <div className="flex flex-col gap-3">
        <Link href="/" className="w-fit font-mono text-xs text-ink-muted hover:text-ink">
          ← inicio
        </Link>
        <h1 className="font-serif text-3xl text-ink">{TITLE}</h1>
        <p className="text-ink-muted">
          cursos.unaividal.com es un catálogo independiente de cursos gratuitos de YouTube y
          Udemy, mantenido por Unai Vidal. No es una plataforma de
          formación: no aloja cursos ni vende nada. Su trabajo es ayudarte a encontrar, entre lo
          mucho que hay, cursos completos que de verdad no cuestan dinero.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-serif text-xl text-ink">Por qué existe</h2>
        <p className="text-ink-muted">
          Buscar «curso gratis» devuelve una mezcla de cursos realmente gratuitos, pruebas de siete
          días, cupones que caducan y anuncios de cursos de pago. Encontrar los buenos lleva
          tiempo. Este proyecto nace para ahorrarlo: reunir en un solo sitio cursos completos y
          gratuitos, ordenados por materia, con la fecha en la que se comprobó que seguían siéndolo.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-serif text-xl text-ink">Qué encontrarás</h2>
        <ul className="flex list-disc flex-col gap-2 pl-5 text-ink-muted">
          <li>
            <strong className="font-medium text-ink">Fichas de curso</strong> con los datos que
            podemos comprobar: autor, duración, capítulos o lecciones y, cuando la hay, una nota
            editorial propia.
          </li>
          <li>
            <strong className="font-medium text-ink">Páginas por categoría</strong> con una
            introducción a la materia y consejos para sacar partido a los cursos.
          </li>
          <li>
            <Link href="/guias" className="text-ink underline underline-offset-4 hover:text-stamp-red">
              Guías
            </Link>{" "}
            con hojas de ruta para empezar desde cero en programación, datos, diseño o idiomas.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-serif text-xl text-ink">Cómo se elige lo que se publica</h2>
        <p className="text-ink-muted">
          Ningún curso se publica automáticamente. Las fichas de YouTube se descubren
          semiautomáticamente entre canales educativos concretos, pero quedan pendientes hasta que
          una persona las revisa. Las de Udemy se añaden una a una, tras comprobar que el curso es
          gratuito sin cupón. El detalle está en{" "}
          <Link
            href="/como-verificamos"
            className="text-ink underline underline-offset-4 hover:text-stamp-red"
          >
            Cómo verificamos los cursos
          </Link>
          .
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-serif text-xl text-ink">Independencia y financiación</h2>
        <p className="text-ink-muted">
          El sitio puede mostrar publicidad de Google AdSense para cubrir los costes de
          mantenimiento, siempre con el consentimiento que exige la normativa (ver{" "}
          <Link
            href="/privacidad"
            className="text-ink underline underline-offset-4 hover:text-stamp-red"
          >
            Privacidad
          </Link>
          ). La publicidad no influye en qué cursos se listan ni en cómo se ordenan. Los enlaces a
          los cursos no son de afiliado: no se cobra comisión por ninguna inscripción.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-serif text-xl text-ink">Correcciones y sugerencias</h2>
        <p className="text-ink-muted">
          Si un curso ya no es gratuito, un enlace está roto o echas en falta un curso, cuéntalo
          desde la página de{" "}
          <Link
            href="/contacto"
            className="text-ink underline underline-offset-4 hover:text-stamp-red"
          >
            contacto
          </Link>{" "}
          o{" "}
          <Link
            href="/sugerir"
            className="text-ink underline underline-offset-4 hover:text-stamp-red"
          >
            sugiere un curso
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
