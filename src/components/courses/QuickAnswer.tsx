import type { QuickAnswer as QuickAnswerData } from "@/lib/courses/quick-answer";

/**
 * "Respuesta rápida": the course's key facts as one sentence plus a
 * definition list, right under the header — answer first, detail after.
 * Data comes from lib/courses/quick-answer.ts.
 */
export function QuickAnswer({ answer }: { answer: QuickAnswerData }) {
  return (
    <section aria-labelledby="respuesta-rapida" className="flex flex-col gap-4 border border-rule bg-card p-6">
      <h2 id="respuesta-rapida" className="font-mono text-[11px] uppercase tracking-wide text-ink-muted">
        Respuesta rápida
      </h2>
      <p className="font-serif text-lg leading-snug text-ink">{answer.sentence}</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        {answer.facts.map((fact) => (
          <div key={fact.label} className="contents">
            <dt className="pt-0.5 font-mono text-[11px] uppercase tracking-wide text-ink-muted">{fact.label}</dt>
            <dd className="text-ink">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
