import { describe, expect, it } from "vitest";
import { buildCategoryFaq, faqAnswerText } from "./category-faq";
import { sampleAnalysis } from "./ai-analysis.fixture";
import type { CourseRecord } from "./schema";

function course(slug: string, extra: Partial<CourseRecord> = {}): CourseRecord {
  return {
    slug,
    title: slug.toUpperCase(),
    platform: "youtube",
    category: "programming",
    sourceUrl: "https://example.com",
    freeStatus: "free",
    status: "published",
    lastVerifiedAt: "2026-01-01",
    youtube: { videoId: slug, channelId: "UC" },
    ...extra,
  };
}

const verdict = (score: number) => ({
  ...sampleAnalysis,
  verdict: { ...sampleAnalysis.verdict, score, recommendation: "recomendado" as const },
});

describe("buildCategoryFaq", () => {
  it("names the best-rated analyzed courses, best first, with links", () => {
    const faq = buildCategoryFaq({
      categoryName: "Programación",
      courses: [
        course("a", { aiAnalysis: verdict(3) }),
        course("b", { aiAnalysis: verdict(5), author: "midudev" }),
        course("c"),
      ],
    });
    expect(faq[0].question).toBe("¿Cuál es el mejor curso gratis de Programación?");
    expect(faq[0].answer).toContainEqual({ href: "/programming/b", label: "B" });
    expect(faqAnswerText(faq[0].answer)).toContain("los mejor valorados son B (de midudev; 5/5, recomendado) y A (3/5, recomendado).");
  });

  it("points beginners to a principiante course and the learning path", () => {
    const faq = buildCategoryFaq({
      categoryName: "Diseño",
      courses: [course("figma", { aiLevel: "principiante", durationSeconds: 3600 })],
      startGuide: { slug: "ruta-diseno", title: "Ruta de diseño" },
    });
    const beginner = faq.find((item) => item.question.includes("principiante"));
    expect(faqAnswerText(beginner!.answer)).toBe(
      "Empieza por FIGMA, un curso de nivel principiante de 1 h en YouTube. Si quieres un orden completo de principio a fin, sigue nuestra ruta Ruta de diseño."
    );
    expect(beginner!.answer).toContainEqual({ href: "/guias/ruta-diseno", label: "Ruta de diseño" });
  });

  it("always explains the free check and counts the catalog", () => {
    const faq = buildCategoryFaq({
      categoryName: "Idiomas",
      courses: [course("x"), course("y", { platform: "udemy", aiAnalysis: verdict(4) })],
    });
    expect(faq.map((item) => item.question)).toEqual([
      "¿Cuál es el mejor curso gratis de Idiomas?",
      "¿Son realmente gratis estos cursos de Idiomas?",
      "¿Cuántos cursos gratis de Idiomas hay?",
    ]);
    expect(faq[1].answer).toContainEqual({ href: "/como-verificamos", label: "cómo verificamos los cursos" });
    expect(faqAnswerText(faq[2].answer)).toBe(
      "Ahora mismo hay 2 cursos gratis de Idiomas en el catálogo (1 en YouTube y 1 en Udemy), 1 de ellos con análisis editorial completo."
    );
  });

  it("keeps only the free-check answer for an empty category", () => {
    expect(buildCategoryFaq({ categoryName: "Vacía", courses: [] }).map((item) => item.question)).toEqual([
      "¿Son realmente gratis estos cursos de Vacía?",
    ]);
  });
});
