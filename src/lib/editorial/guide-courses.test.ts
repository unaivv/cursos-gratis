import { describe, expect, it } from "vitest";
import { matchGuideCourses } from "./guide-courses";
import { GUIDES, getGuide, guideWordCount, relatedGuides, sectionId } from "./guides";
import { sampleAnalysis } from "@/lib/courses/ai-analysis.fixture";
import type { CourseRecord } from "@/lib/courses/schema";
import type { Guide } from "./guides";

function course(slug: string, title: string, category = "programming", extra: Partial<CourseRecord> = {}): CourseRecord {
  return {
    slug,
    title,
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

const guide: Guide = {
  slug: "g",
  kind: "ruta",
  title: "G",
  shortTitle: "G",
  description: "D",
  categorySlug: "programming",
  courseMatch: { categories: ["programming", "design"], keywords: ["react", "go"] },
  published: "2026-01-01",
  updated: "2026-01-01",
  intro: "I",
  sections: [],
};

describe("matchGuideCourses", () => {
  it("prefers keyword matches, ranked by editorial verdict, then fills from the home category", () => {
    const strong = { ...sampleAnalysis, verdict: { ...sampleAnalysis.verdict, score: 5 } };
    const result = matchGuideCourses(guide, [
      course("react-basic", "Curso de React"),
      course("react-top", "React desde cero", "programming", { aiAnalysis: strong }),
      course("google", "Google Sheets"),
      course("figma", "Figma", "design"),
      course("cooking", "Cocina", "crafts"),
    ]);
    expect(result.map((c) => c.slug)).toEqual(["react-top", "react-basic", "google"]);
  });

  it("returns nothing for guides without a category", () => {
    expect(matchGuideCourses({ ...guide, categorySlug: undefined, courseMatch: undefined }, [course("a", "A")])).toEqual([]);
  });
});

describe("guides content", () => {
  it("has unique slugs, valid related guides and internal guide links", () => {
    const slugs = new Set(GUIDES.map((g) => g.slug));
    expect(slugs.size).toBe(GUIDES.length);
    for (const g of GUIDES) {
      for (const related of g.related ?? []) expect(slugs.has(related), `${g.slug} → ${related}`).toBe(true);
      for (const link of g.sections.flatMap((s) => s.links ?? [])) {
        if (link.href.startsWith("/guias/")) expect(getGuide(link.href.slice(7)), link.href).toBeDefined();
      }
    }
  });

  it("gives every learning path substantial text", () => {
    const newPaths = GUIDES.filter((g) => g.published >= "2026-09-30");
    expect(newPaths.length).toBeGreaterThanOrEqual(20);
    for (const g of newPaths) expect(guideWordCount(g), g.slug).toBeGreaterThan(800);
  });

  it("has unique section anchors within each guide", () => {
    for (const g of GUIDES) {
      const ids = g.sections.map((s) => sectionId(s.heading));
      expect(new Set(ids).size, g.slug).toBe(ids.length);
    }
  });

  it("relatedGuides never includes the guide itself", () => {
    for (const g of GUIDES) expect(relatedGuides(g).map((r) => r.slug)).not.toContain(g.slug);
  });
});
