import { RECOMMENDATION_LABEL, type CourseAnalysis } from "@/lib/courses/ai-analysis";

const TONE: Record<CourseAnalysis["verdict"]["recommendation"], string> = {
  "muy-recomendado": "text-[var(--fresh-green)]",
  recomendado: "text-ink",
  "con-reservas": "text-stamp-gold",
};

/**
 * The editorial verdict as a compact mono line: five ink dots filled up
 * to the score, then the recommendation label. Dots rather than stars —
 * it's our index-card reading, not a shopping rating.
 */
export function VerdictBadge({ verdict, size = "sm" }: { verdict: CourseAnalysis["verdict"]; size?: "sm" | "lg" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono ${size === "lg" ? "text-sm" : "text-[11px]"} ${TONE[verdict.recommendation]}`}
    >
      <span aria-hidden="true" className="tracking-[0.15em]">
        {"●".repeat(verdict.score)}
        <span className="text-rule">{"●".repeat(5 - verdict.score)}</span>
      </span>
      <span>
        {RECOMMENDATION_LABEL[verdict.recommendation]}
        <span className="sr-only">, valoración editorial {verdict.score} de 5</span>
      </span>
    </span>
  );
}
