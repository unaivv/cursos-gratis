import { describe, expect, it } from "vitest";
import { courseAnalysisSchema, parseAnalysis, recommendationRank, resolveRelated } from "./ai-analysis";
import { sampleAnalysis } from "./ai-analysis.fixture";

describe("courseAnalysisSchema", () => {
  it("accepts a well-formed analysis", () => {
    expect(courseAnalysisSchema.safeParse(sampleAnalysis).success).toBe(true);
  });

  it("rejects out-of-range scores, empty outcomes and oversized FAQs", () => {
    expect(courseAnalysisSchema.safeParse({ ...sampleAnalysis, verdict: { ...sampleAnalysis.verdict, score: 6 } }).success).toBe(false);
    expect(courseAnalysisSchema.safeParse({ ...sampleAnalysis, outcomes: [] }).success).toBe(false);
    const faq = Array.from({ length: 6 }, () => sampleAnalysis.faq[0]);
    expect(courseAnalysisSchema.safeParse({ ...sampleAnalysis, faq }).success).toBe(false);
  });
});

describe("parseAnalysis", () => {
  it("returns null for malformed stored JSON instead of throwing", () => {
    expect(parseAnalysis(null)).toBeNull();
    expect(parseAnalysis({ version: 1 })).toBeNull();
    expect(parseAnalysis(sampleAnalysis)).not.toBeNull();
  });
});

describe("resolveRelated", () => {
  it("keeps only existing, distinct courses other than the course itself", () => {
    const analysis = {
      ...sampleAnalysis,
      related: [
        { slug: "otro-curso", relation: "despues" as const, reason: "Sigue aquí." },
        { slug: "otro-curso", relation: "antes" as const, reason: "Duplicado." },
        { slug: "no-existe", relation: "antes" as const, reason: "Ya no está." },
        { slug: "este-curso", relation: "alternativa" as const, reason: "Él mismo." },
      ],
    };
    const catalog = [{ slug: "otro-curso" }, { slug: "este-curso" }];
    const related = resolveRelated(analysis, catalog, "este-curso");
    expect(related).toHaveLength(1);
    expect(related[0]).toMatchObject({ course: { slug: "otro-curso" }, relation: "despues" });
  });
});

describe("recommendationRank", () => {
  it("orders by score, then recommendation, with no analysis last", () => {
    const strong = { ...sampleAnalysis, verdict: { ...sampleAnalysis.verdict, score: 5, recommendation: "muy-recomendado" as const } };
    expect(recommendationRank(strong)).toBeGreaterThan(recommendationRank(sampleAnalysis));
    expect(recommendationRank(undefined)).toBe(0);
  });
});
