import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";

// Static content, but the layout's SiteFooter does a live DB read (the
// category list) — force-dynamic like every other route so that query
// runs per-request instead of Next trying it at build time.
export const dynamic = "force-dynamic";

const TITLE = "Cómo verificamos los cursos";
const DESCRIPTION =
  "El proceso que sigue cursos.unaividal.com para comprobar que cada curso listado sigue siendo gratis.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const FAQ = [
  {
    question: "¿Los cursos son gratis de verdad, o son una prueba gratuita?",
    answer:
      "Solo listamos cursos completos y permanentemente gratuitos: vídeos y listas de reproducción abiertas en YouTube, y cursos de Udemy verificados manualmente como \"Gratis (sin cupón)\" — sin periodo de prueba, sin límite de tiempo. Un curso que pasa a ser de pago se retira del catálogo, no se marca como \"antes gratis\".",
  },
  {
    question: "¿Hace falta crear una cuenta o pagar algo en cursos.unaividal.com?",
    answer:
      "No. El sitio no aloja ningún curso ni pide registro — cada ficha enlaza directamente a la clase original en YouTube o Udemy, donde sí puede pedirte una cuenta gratuita de esa plataforma para verlo.",
  },
  {
    question: "¿Qué significa la fecha de \"verificado\"?",
    answer:
      "Es la última vez que alguien comprobó a mano que el curso seguía existiendo y siendo gratis. Un sello reciente (verde) es una comprobación fresca; uno de más de un mes (rojo, \"pendiente de revisar\") significa que toca volver a comprobarlo — no que el curso haya dejado de ser gratis.",
  },
  {
    question: "¿Con qué frecuencia se revisan los cursos?",
    answer:
      "No hay un calendario fijo todavía: la revisión es manual y se hace por lotes al añadir cursos nuevos o al detectar que uno puede haber cambiado. Es la primera mejora prevista en el proceso.",
  },
  {
    question: "¿Cómo elegís qué cursos incluir?",
    answer:
      "De YouTube, cursos completos de canales educativos reconocidos (freeCodeCamp, CS50, midudev...). De Udemy, cursos de la sección de cursos gratuitos, confirmados uno a uno como gratuitos sin cupón antes de publicarlos.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function MethodologyPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-16">
      <JsonLd data={faqJsonLd} />

      <div className="flex flex-col gap-3">
        <Link href="/" className="w-fit font-mono text-xs text-ink-muted hover:text-ink">
          ← inicio
        </Link>
        <h1 className="font-serif text-3xl text-ink">{TITLE}</h1>
        <p className="text-ink-muted">
          cursos.unaividal.com no aloja ningún curso: cataloga clases gratuitas que ya existen en
          YouTube y Udemy, y enlaza a la fuente original. La única promesa real que puede hacer un
          catálogo así es que lo que enlaza sigue siendo gratis — así que eso es lo que
          comprobamos.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-serif text-xl text-ink">El proceso</h2>
        <ol className="flex flex-col gap-3 text-ink-muted">
          <li>
            <strong className="text-ink">1. Selección.</strong> De YouTube, cursos completos de
            canales educativos con trayectoria (freeCodeCamp, CS50, midudev...). De Udemy, cursos
            listados como gratis, revisados uno a uno.
          </li>
          <li>
            <strong className="text-ink">2. Verificación manual.</strong> Antes de publicar un
            curso de Udemy, se confirma en la propia página que dice &ldquo;Gratis&rdquo; sin
            necesidad de cupón — no basta con que aparezca en un listado de &ldquo;ofertas&rdquo;.
          </li>
          <li>
            <strong className="text-ink">3. Fecha de verificación.</strong> Cada ficha guarda la
            fecha de esa última comprobación — es el dato que colorea el sello &ldquo;verificado
            {" "}·{" "}fecha&rdquo; en cada tarjeta.
          </li>
          <li>
            <strong className="text-ink">4. Baja.</strong> Un curso que deja de ser gratis o deja
            de existir se retira del catálogo en lugar de quedar publicado con una etiqueta
            desactualizada.
          </li>
        </ol>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-serif text-xl text-ink">Preguntas frecuentes</h2>
        <dl className="flex flex-col gap-6">
          {FAQ.map((item) => (
            <div key={item.question} className="flex flex-col gap-1.5">
              <dt className="font-medium text-ink">{item.question}</dt>
              <dd className="text-ink-muted">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </main>
  );
}
