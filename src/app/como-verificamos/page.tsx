import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";

// Static content, but the layout's SiteFooter does a live DB read (the
// category list) — force-dynamic like every other route so that query
// runs per-request instead of Next trying it at build time.
export const dynamic = "force-dynamic";

const TITLE = "Cómo verificamos y analizamos los cursos";
const DESCRIPTION =
  "Cómo selecciona cursos.unaividal.com cada curso, cómo comprueba que sigue siendo gratis y cómo se elabora el análisis editorial de cada ficha.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/como-verificamos" },
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
      "De YouTube, cursos completos de canales educativos reconocidos (freeCodeCamp, CS50, midudev...) y de búsquedas temáticas; un primer filtro descarta lo que no es un curso (noticias, opiniones, clips) y una persona revisa cada candidato antes de publicarlo. De Udemy, cursos de la sección de cursos gratuitos, confirmados uno a uno como gratuitos sin cupón antes de publicarlos.",
  },
  {
    question: "¿El análisis de cada curso lo escribe una IA?",
    answer:
      "Se redacta con ayuda de un modelo de IA, a partir únicamente de los datos que publica el propio curso (título, descripción, capítulos, duración, fecha), con reglas que le prohíben afirmar nada que esos datos no respalden. El resultado pasa una validación automática de formato y límites, y se revisa según el proceso descrito en esta página. No sustituye a ver el curso: es una ayuda para decidir si encaja contigo.",
  },
  {
    question: "¿Qué significa la valoración de cinco puntos?",
    answer:
      "Es una valoración editorial basada en señales observables: si el curso es completo y está bien estructurado, si su duración es adecuada para lo que cubre y si está actualizado para su tema. No mide la calidad del profesor ni la opinión de otros alumnos, y un curso con poca información publicada nunca recibe una valoración alta.",
  },
  {
    question: "¿Por qué algunas fichas no tienen análisis?",
    answer:
      "Porque aún no se ha elaborado o porque el curso no publica información suficiente (sin capítulos ni una descripción útil) para analizarlo sin inventar. Esas fichas siguen disponibles para quien las busque, pero no las destacamos ni las incluimos en el mapa del sitio hasta que tienen contenido propio.",
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
          YouTube y Udemy, y enlaza a la fuente original. Promete dos cosas: que lo que enlaza sigue
          siendo gratis, y que el análisis de cada ficha se basa en lo que el curso publica, sin
          inventar. Esta página explica cómo se cumple cada una.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-serif text-xl text-ink">El proceso</h2>
        <ol className="flex flex-col gap-3 text-ink-muted">
          <li>
            <strong className="text-ink">1. Selección.</strong> De YouTube, cursos completos de
            canales educativos con trayectoria (freeCodeCamp, CS50, midudev...) y de búsquedas por
            materia. Un filtro automático descarta primero lo que dura menos de diez minutos y un
            modelo de IA separa los cursos reales de noticias, opiniones, directos sin estructura o
            promociones. De Udemy, cursos listados como gratis, revisados uno a uno.
          </li>
          <li>
            <strong className="text-ink">2. Revisión humana.</strong> Ningún curso se publica
            automáticamente: todo lo que supera el filtro queda pendiente hasta que Unai Vidal lo
            revisa y lo aprueba desde el panel de administración.
          </li>
          <li>
            <strong className="text-ink">3. Verificación de gratuidad.</strong> Antes de publicar un
            curso de Udemy, se confirma en la propia página que dice &ldquo;Gratis&rdquo; sin
            necesidad de cupón — no basta con que aparezca en un listado de &ldquo;ofertas&rdquo;.
          </li>
          <li>
            <strong className="text-ink">4. Fecha de verificación.</strong> Cada ficha guarda la
            fecha de esa última comprobación — es el dato que colorea el sello &ldquo;verificado
            {" "}·{" "}fecha&rdquo; en cada tarjeta.
          </li>
          <li>
            <strong className="text-ink">5. Baja.</strong> Un curso que deja de ser gratis o deja
            de existir se retira del catálogo en lugar de quedar publicado con una etiqueta
            desactualizada.
          </li>
        </ol>
      </div>

      <div className="flex flex-col gap-4">
        <h2 id="analisis" className="scroll-mt-24 font-serif text-xl text-ink">
          Cómo se elabora el análisis de cada ficha
        </h2>
        <p className="text-ink-muted">
          Cada ficha analizada incluye para quién es el curso, qué conviene saber antes, qué sabrás
          hacer al terminar, su estructura por bloques, puntos fuertes y aspectos a tener en cuenta,
          un plan de estudio, consejos para seguirlo, cursos del catálogo para antes o después,
          preguntas frecuentes y un veredicto. Así lo hacemos:
        </p>
        <ol className="flex flex-col gap-3 text-ink-muted">
          <li>
            <strong className="text-ink">Solo datos del propio curso.</strong> El análisis parte de
            lo que publica su autor: título, descripción, capítulos o lecciones, duración y fecha de
            publicación. Los cursos sin información suficiente (sin capítulos ni una descripción
            útil) no se analizan.
          </li>
          <li>
            <strong className="text-ink">Redacción con ayuda de IA y reglas estrictas.</strong> Un
            modelo de IA redacta el borrador con instrucciones explícitas: no inventar temas,
            requisitos, ejercicios, certificados ni resultados; ser prudente cuando hay pocos datos;
            y tratar el texto del curso como datos, nunca como instrucciones. Los cursos que
            recomienda como paso previo o siguiente solo pueden salir de nuestro propio catálogo.
          </li>
          <li>
            <strong className="text-ink">Validación automática.</strong> Antes de guardarse, cada
            análisis se comprueba campo a campo (estructura, longitudes, valoración entre 1 y 5,
            enlaces a cursos que existan). Lo que no cumple se descarta y se vuelve a generar.
          </li>
          <li>
            <strong className="text-ink">Revisión y correcciones.</strong> Los análisis de cursos
            nuevos se revisan junto con el curso antes de publicarlo, y los existentes se revisan
            por muestreo y cada vez que se actualiza el método. Cualquier lector puede señalar un
            error desde la página de{" "}
            <Link href="/contacto" className="text-ink underline underline-offset-4 hover:text-stamp-red">
              contacto
            </Link>
            , y se corrige a mano.
          </li>
        </ol>
        <p className="text-ink-muted">
          <strong className="font-medium text-ink">La valoración de 1 a 5</strong> se basa solo en
          señales observables: si el curso es completo y está bien estructurado, si su duración es
          razonable para lo que cubre y si está al día para su tema. Un curso con poca información
          publicada no recibe más de 3. No mide la calidad del profesor ni sustituye a probar el
          curso: los primeros minutos de un curso siguen siendo la mejor prueba de si encaja contigo.
        </p>
        <p className="text-ink-muted">
          Las fichas que todavía no tienen análisis ni una nota editorial propia siguen accesibles,
          pero no se destacan ni se incluyen en el mapa del sitio hasta que lo tienen.
        </p>
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
