import { z } from "zod";

/**
 * The rich per-course editorial analysis (who it's for, outcomes,
 * structure, strengths/weaknesses, study plan, verdict, FAQ). Written by
 * the AI review (scripts/ai-review.ts) from the course's own public data
 * only, validated here before it ever reaches the database, and rendered
 * on the course page. A course page with a valid analysis is what makes
 * it indexable — see lib/courses/depth.ts.
 *
 * Bump ANALYSIS_VERSION when the prompt or this shape changes in a way
 * worth regenerating: the backfill re-runs every course below it.
 */
export const ANALYSIS_VERSION = 1;

const line = (max: number) => z.string().trim().min(3).max(max);

export const RECOMMENDATIONS = ["muy-recomendado", "recomendado", "con-reservas"] as const;
export type Recommendation = (typeof RECOMMENDATIONS)[number];

export const RELATIONS = ["antes", "despues", "alternativa"] as const;
export type Relation = (typeof RELATIONS)[number];

export const courseAnalysisSchema = z.object({
  version: z.number().int().positive(),
  audience: z.object({
    forWho: z.array(line(220)).min(1).max(4),
    notFor: z.array(line(220)).max(3),
  }),
  // Empty = the data doesn't say; the page then says so instead of guessing.
  prerequisites: z.array(line(200)).max(5),
  outcomes: z.array(line(200)).min(2).max(6),
  syllabus: z
    .array(
      z.object({
        title: line(100),
        summary: line(400),
      })
    )
    .max(10),
  strengths: z.array(line(220)).min(1).max(4),
  weaknesses: z.array(line(220)).min(1).max(4),
  studyPlan: z.object({
    weeks: z.number().int().min(1).max(52).nullable(),
    hoursPerWeek: z.number().min(0.5).max(40).nullable(),
    steps: z.array(line(260)).min(2).max(6),
  }),
  tips: z.array(line(260)).min(2).max(5),
  related: z
    .array(
      z.object({
        slug: z.string().trim().min(1).max(200),
        relation: z.enum(RELATIONS),
        reason: line(220),
      })
    )
    .max(4),
  verdict: z.object({
    summary: z.string().trim().min(40).max(600),
    recommendation: z.enum(RECOMMENDATIONS),
    score: z.number().int().min(1).max(5),
  }),
  faq: z
    .array(
      z.object({
        question: line(160),
        answer: z.string().trim().min(10).max(600),
      })
    )
    .min(2)
    .max(5),
});

export type CourseAnalysis = z.infer<typeof courseAnalysisSchema>;

/**
 * Parses a stored/imported analysis, dropping it (null) when it doesn't
 * fit the current shape — a malformed JSON blob must never break a page.
 */
export function parseAnalysis(raw: unknown): CourseAnalysis | null {
  const parsed = courseAnalysisSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

/**
 * Keeps only related-course suggestions that point at a real, different
 * course in the catalog — the model only sees a candidate list, but a
 * slug can disappear (course unpublished) after the analysis was written.
 */
export function resolveRelated<T extends { slug: string }>(
  analysis: CourseAnalysis,
  catalog: T[],
  selfSlug: string
): { course: T; relation: Relation; reason: string }[] {
  const bySlug = new Map(catalog.map((course) => [course.slug, course]));
  const seen = new Set<string>();
  const out: { course: T; relation: Relation; reason: string }[] = [];
  for (const item of analysis.related) {
    const course = bySlug.get(item.slug);
    if (!course || item.slug === selfSlug || seen.has(item.slug)) continue;
    seen.add(item.slug);
    out.push({ course, relation: item.relation, reason: item.reason });
  }
  return out;
}

export const RECOMMENDATION_LABEL: Record<Recommendation, string> = {
  "muy-recomendado": "Muy recomendado",
  recomendado: "Recomendado",
  "con-reservas": "Con reservas",
};

export const RELATION_LABEL: Record<Relation, string> = {
  antes: "Antes de este curso",
  despues: "Después de este curso",
  alternativa: "Alternativa",
};

/** Ranking key for "most recommended" lists: score first, then recommendation. */
export function recommendationRank(analysis: CourseAnalysis | undefined | null): number {
  if (!analysis) return 0;
  const bonus = { "muy-recomendado": 2, recomendado: 1, "con-reservas": 0 }[analysis.verdict.recommendation];
  return analysis.verdict.score * 10 + bonus;
}
