import type { Metadata } from "next";
import Link from "next/link";
import { GUIDE_KIND_LABEL, guidesByKind, readingMinutes, type Guide, type GuideKind } from "@/lib/editorial/guides";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdsterraLeaderboard } from "@/components/ads/AdsterraBanner";
import { Fragment } from "react";
import { SITE_URL } from "@/lib/site";

// The layout's SiteFooter reads categories from the DB — see como-verificamos.
export const dynamic = "force-dynamic";

const TITLE = "Guías y rutas para aprender gratis";
const DESCRIPTION =
  "Rutas de aprendizaje por materia, métodos de estudio y criterios para elegir cursos gratuitos de YouTube y Udemy, escritas por Unai Vidal.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/guias" },
  openGraph: { title: TITLE, description: DESCRIPTION },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const GROUPS: { kind: GuideKind; id: string; heading: string; intro: string }[] = [
  {
    kind: "ruta",
    id: "rutas",
    heading: "Rutas de aprendizaje",
    intro:
      "Un camino por etapas para cada materia: qué aprender primero, cuánto tiempo dedicar, qué practicar y cuándo pasar a la siguiente etapa. Cada ruta enlaza con los cursos del catálogo que encajan.",
  },
  {
    kind: "metodo",
    id: "metodo",
    heading: "Método de estudio",
    intro:
      "Cómo seguir un curso hasta el final, tomar apuntes que sirvan, planificar la semana, consolidar con proyectos y demostrar lo aprendido.",
  },
  {
    kind: "eleccion",
    id: "elegir",
    heading: "Elegir bien",
    intro: "Criterios para decidir qué curso y qué plataforma merecen tu tiempo antes de empezar.",
  },
];

function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link
      href={`/guias/${guide.slug}`}
      className="group flex h-full flex-col gap-2 border border-rule bg-card p-5 transition-colors hover:border-ink"
    >
      <h3 className="font-serif text-lg leading-snug text-ink group-hover:underline group-hover:decoration-rule group-hover:underline-offset-4">
        {guide.title}
      </h3>
      <p className="text-sm text-ink-muted">{guide.description}</p>
      <span className="mt-auto pt-2 font-mono text-[11px] text-ink-muted">{readingMinutes(guide)} min de lectura</span>
    </Link>
  );
}

export default function GuidesIndexPage() {
  const groups = GROUPS.map((group) => ({ ...group, guides: guidesByKind(group.kind) }));

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/guias`,
    inLanguage: "es",
    author: { "@type": "Person", name: "Unai Vidal", url: "https://unaividal.com" },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: groups
        .flatMap((group) => group.guides)
        .map((guide, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${SITE_URL}/guias/${guide.slug}`,
          name: guide.title,
        })),
    },
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-6 py-16">
      <JsonLd data={collectionJsonLd} />
      <div className="flex max-w-2xl flex-col gap-3">
        <Link href="/" className="w-fit font-mono text-xs text-ink-muted hover:text-ink">
          ← inicio
        </Link>
        <h1 className="font-serif text-3xl text-ink md:text-4xl">{TITLE}</h1>
        <p className="text-ink-muted">
          Un catálogo de cursos responde a «qué hay»; estas guías responden a «por dónde empiezo», «en qué orden» y
          «cómo llego hasta el final». Están escritas a partir de la experiencia de aprender por cuenta propia y se
          revisan cuando cambian las herramientas o el catálogo.
        </p>
        <nav aria-label="Secciones" className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-ink-muted">
          {groups.map((group) => (
            <a key={group.id} href={`#${group.id}`} className="underline underline-offset-2 hover:text-ink">
              {group.heading} ({group.guides.length})
            </a>
          ))}
        </nav>
      </div>

      <AdsterraLeaderboard />

      {groups.map((group, index) => (
        <Fragment key={group.id}>
          {/* Mid-page unit after the first (longest) group. */}
          {index === 1 && <AdsterraLeaderboard />}
          <section aria-labelledby={group.id} className="flex flex-col gap-5">
            <div className="flex max-w-2xl flex-col gap-2">
              <span className="text-sm text-stamp-red">{GUIDE_KIND_LABEL[group.kind]}</span>
              <h2 id={group.id} className="scroll-mt-24 font-serif text-2xl text-ink">
                {group.heading}
              </h2>
              <p className="text-ink-muted">{group.intro}</p>
            </div>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.guides.map((guide) => (
                <li key={guide.slug}>
                  <GuideCard guide={guide} />
                </li>
              ))}
            </ul>
          </section>
        </Fragment>
      ))}
    </main>
  );
}
