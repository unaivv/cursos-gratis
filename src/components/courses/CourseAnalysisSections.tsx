import type { ReactNode } from "react";
import Link from "next/link";
import { RELATION_LABEL, type CourseAnalysis, type Relation } from "@/lib/courses/ai-analysis";
import type { CourseRecord } from "@/lib/courses/schema";
import { VerdictBadge } from "./VerdictBadge";

export type ResolvedRelated = { course: CourseRecord; relation: Relation; reason: string };

/** Anchors of the analysis sections, in page order — for the "En esta ficha" index. */
export const ANALYSIS_TOC = [
  { id: "veredicto", label: "Veredicto" },
  { id: "para-quien", label: "Para quién es" },
  { id: "resultados", label: "Qué aprenderás" },
  { id: "estructura", label: "Estructura" },
  { id: "plan", label: "Plan de estudio" },
  { id: "consejos", label: "Consejos" },
  { id: "preguntas", label: "Preguntas frecuentes" },
] as const;

function Heading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 font-serif text-xl text-ink">
      {children}
    </h2>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-1.5 pl-5 text-ink-muted">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/** Verdict: score, recommendation, summary, strengths and caveats. */
export function VerdictSection({ analysis }: { analysis: CourseAnalysis }) {
  return (
    <section aria-labelledby="veredicto" className="flex flex-col gap-4 border border-rule bg-card p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <Heading id="veredicto">Nuestro veredicto</Heading>
        <VerdictBadge verdict={analysis.verdict} size="lg" />
      </div>
      <p className="text-ink">{analysis.verdict.summary}</p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <h3 className="font-mono text-[11px] uppercase tracking-wide text-ink-muted">Puntos fuertes</h3>
          <Bullets items={analysis.strengths} />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-mono text-[11px] uppercase tracking-wide text-ink-muted">A tener en cuenta</h3>
          <Bullets items={analysis.weaknesses} />
        </div>
      </div>
    </section>
  );
}

/** Audience, prerequisites and outcomes. */
export function AudienceSections({ analysis }: { analysis: CourseAnalysis }) {
  return (
    <>
      <section aria-labelledby="para-quien" className="flex flex-col gap-4">
        <Heading id="para-quien">Para quién es este curso</Heading>
        <Bullets items={analysis.audience.forWho} />
        {analysis.audience.notFor.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="font-medium text-ink">Mejor busca otro si…</h3>
            <Bullets items={analysis.audience.notFor} />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <h3 className="font-medium text-ink">Antes de empezar</h3>
          {analysis.prerequisites.length > 0 ? (
            <Bullets items={analysis.prerequisites} />
          ) : (
            <p className="text-ink-muted">La información publicada del curso no detalla requisitos previos.</p>
          )}
        </div>
      </section>

      <section aria-labelledby="resultados" className="flex flex-col gap-4">
        <Heading id="resultados">Qué sabrás hacer al terminar</Heading>
        <Bullets items={analysis.outcomes} />
      </section>
    </>
  );
}

/** Syllabus blocks — the chapter list itself is rendered by the page. */
export function SyllabusBlocks({ analysis }: { analysis: CourseAnalysis }) {
  if (analysis.syllabus.length === 0) return null;
  return (
    <ol className="flex flex-col gap-4">
      {analysis.syllabus.map((block, index) => (
        <li key={block.title} className="flex gap-4">
          <span className="w-8 shrink-0 font-mono text-sm text-stamp-red">{String(index + 1).padStart(2, "0")}</span>
          <div className="flex flex-col gap-1">
            <h3 className="font-medium text-ink">{block.title}</h3>
            <p className="text-sm text-ink-muted">{block.summary}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Study plan and course-specific tips. */
export function StudySections({ analysis }: { analysis: CourseAnalysis }) {
  const { weeks, hoursPerWeek, steps } = analysis.studyPlan;
  return (
    <>
      <section aria-labelledby="plan" className="flex flex-col gap-4">
        <Heading id="plan">Plan de estudio sugerido</Heading>
        {weeks && hoursPerWeek && (
          <p className="font-mono text-sm text-ink">
            {weeks} semana{weeks === 1 ? "" : "s"} · unas {String(hoursPerWeek).replace(".", ",")} h por semana
          </p>
        )}
        <ol className="flex flex-col gap-2 text-ink-muted">
          {steps.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="w-6 shrink-0 font-mono text-xs leading-6 text-ink-muted">{index + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <p className="text-sm text-ink-muted">
          El plan cuenta con tiempo para pausar y practicar, no solo con la duración del vídeo. Si quieres adaptarlo a tu
          semana, lee{" "}
          <Link href="/guias/plan-de-estudio-semanal" className="text-ink underline underline-offset-4 hover:text-stamp-red">
            cómo montar tu plan de estudio semanal
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="consejos" className="flex flex-col gap-4">
        <Heading id="consejos">Consejos para seguirlo</Heading>
        <Bullets items={analysis.tips} />
      </section>
    </>
  );
}

/** Before / after / alternative courses picked from our own catalog. */
export function RelatedPathSection({ related }: { related: ResolvedRelated[] }) {
  if (related.length === 0) return null;
  return (
    <section aria-labelledby="antes-y-despues" className="flex flex-col gap-4">
      <h2 id="antes-y-despues" className="font-serif text-xl text-ink">
        Antes y después de este curso
      </h2>
      <ul className="flex flex-col gap-3">
        {related.map(({ course, relation, reason }) => (
          <li key={course.slug} className="flex flex-col gap-1 border-l-2 border-rule pl-4">
            <span className="font-mono text-[11px] uppercase tracking-wide text-ink-muted">{RELATION_LABEL[relation]}</span>
            <Link
              href={`/${course.category}/${course.slug}`}
              className="font-serif text-lg leading-snug text-ink underline decoration-rule underline-offset-4 hover:text-stamp-red"
            >
              {course.title}
            </Link>
            <span className="text-sm text-ink-muted">{reason}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** FAQ as native disclosure widgets (no JS). */
export function FaqSection({ faq }: { faq: CourseAnalysis["faq"] }) {
  return (
    <section aria-labelledby="preguntas" className="flex flex-col gap-3">
      <Heading id="preguntas">Preguntas frecuentes</Heading>
      <div className="flex flex-col divide-y divide-rule border-y border-rule">
        {faq.map((item) => (
          <details key={item.question} className="group py-3">
            <summary className="cursor-pointer list-none font-medium text-ink marker:content-none">
              <span className="mr-2 inline-block font-mono text-stamp-red transition-transform group-open:rotate-45">+</span>
              {item.question}
            </summary>
            <p className="mt-2 pl-6 text-ink-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
