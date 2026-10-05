import { describe, expect, it } from "vitest";
import { buildLlmsTxt } from "./llms-txt";
import { sampleAnalysis } from "@/lib/courses/ai-analysis.fixture";
import type { CourseRecord } from "@/lib/courses/schema";
import type { Guide } from "@/lib/editorial/guides";
import { SITE_URL } from "@/lib/site";

function course(slug: string, category: string, extra: Partial<CourseRecord> = {}): CourseRecord {
  return {
    slug,
    title: `Curso ${slug}`,
    platform: "youtube",
    category,
    sourceUrl: "https://example.com",
    freeStatus: "free",
    status: "published",
    lastVerifiedAt: "2026-01-01",
    youtube: { videoId: slug, channelId: "UC" },
    ...extra,
  };
}

const guide = {
  slug: "ruta-python",
  kind: "ruta",
  title: "Aprender Python [gratis]",
  description: "De cero a proyectos.",
} as Guide;

const txt = buildLlmsTxt({
  categories: [
    { slug: "programming", name: "Programación" },
    { slug: "empty", name: "Vacía" },
  ],
  courses: [
    course("a", "programming", { aiAnalysis: sampleAnalysis, aiSummary: "Python desde cero,\nen una tarde." }),
    course("b", "programming"),
  ],
  guides: [guide],
  taglines: { programming: "Lenguajes y web." },
});

describe("buildLlmsTxt", () => {
  it("follows the llmstxt.org layout: H1, blockquote summary, link sections", () => {
    expect(txt.startsWith("# cursosgratis.pro\n\n> ")).toBe(true);
    expect(txt).toContain("## Páginas clave");
    expect(txt).toContain(`- [Cómo verificamos los cursos](${SITE_URL}/como-verificamos)`);
    expect(txt).toContain("## Optional");
    expect(txt.endsWith("\n")).toBe(true);
  });

  it("lists populated categories with their tagline and count", () => {
    expect(txt).toContain(`- [Cursos gratis de Programación](${SITE_URL}/programming): Lenguajes y web. 2 cursos`);
    expect(txt).not.toContain("Vacía");
  });

  it("escapes link brackets in titles", () => {
    expect(txt).toContain(`- [Aprender Python \\[gratis\\]](${SITE_URL}/guias/ruta-python): De cero a proyectos.`);
  });

  it("lists only indexable courses, one line each, with their verdict", () => {
    const { score } = sampleAnalysis.verdict;
    expect(txt).toContain("## Cursos de Programación");
    expect(txt).toContain(`- [Curso a](${SITE_URL}/programming/a): Python desde cero, en una tarde. Valoración: ${score}/5`);
    expect(txt).not.toContain("/programming/b");
  });
});
