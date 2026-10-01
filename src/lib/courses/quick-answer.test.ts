import { describe, expect, it } from "vitest";
import { buildQuickAnswer, courseDateModified, courseLength, courseThumbnailUrl, formatSpanishDate } from "./quick-answer";
import { sampleAnalysis } from "./ai-analysis.fixture";
import type { CourseRecord } from "./schema";

const base: CourseRecord = {
  slug: "python",
  title: "Python",
  platform: "youtube",
  category: "programming",
  sourceUrl: "https://example.com",
  freeStatus: "free",
  status: "published",
  lastVerifiedAt: "2026-09-01",
  youtube: { videoId: "abc123", channelId: "UC" },
};

describe("formatSpanishDate", () => {
  it("formats an ISO date in Spanish without shifting the day", () => {
    expect(formatSpanishDate("2026-09-01")).toBe("1 de septiembre de 2026");
    expect(formatSpanishDate("2026-01-31T23:30:00.000Z")).toBe("31 de enero de 2026");
  });
});

describe("courseLength", () => {
  it("joins duration and lessons, naming single-video lessons as chapters", () => {
    expect(courseLength({ ...base, durationSeconds: 7200, lessonCount: 12 })).toBe("2 h · 12 capítulos");
    expect(
      courseLength({ ...base, lessonCount: 30, youtube: { playlistId: "PL1", channelId: "UC" } })
    ).toBe("30 lecciones");
    expect(courseLength(base)).toBeNull();
  });
});

describe("buildQuickAnswer", () => {
  it("degrades to source facts when there is no analysis", () => {
    const answer = buildQuickAnswer(base, "Programación");
    expect(answer.facts.map((f) => f.label)).toEqual(["Precio", "Verificado"]);
    expect(answer.facts[0].value).toBe("Gratis en YouTube");
    expect(answer.sentence).toBe(
      "Curso gratis de Programación en YouTube. Comprobamos que sigue siendo gratis el 1 de septiembre de 2026."
    );
  });

  it("leads with the verdict and audience when analyzed", () => {
    const answer = buildQuickAnswer(
      { ...base, author: "midudev", aiLevel: "principiante", durationSeconds: 3600, aiAnalysis: sampleAnalysis },
      "Programación"
    );
    const { score } = sampleAnalysis.verdict;
    expect(answer.facts[0]).toEqual({ label: "Veredicto", value: expect.stringContaining(`${score}/5`) });
    expect(answer.facts[1]).toEqual({ label: "Para quién", value: sampleAnalysis.audience.forWho[0] });
    expect(answer.facts.map((f) => f.label)).toContain("Autor");
    expect(answer.sentence).toContain("Curso gratis de Programación de nivel principiante en YouTube impartido por midudev (1 h).");
    expect(answer.sentence).toContain(`Nuestra valoración: ${score}/5`);
  });
});

describe("courseDateModified", () => {
  it("picks the latest of analysis, row update and verification", () => {
    expect(courseDateModified({ lastVerifiedAt: "2026-09-01" })).toBe("2026-09-01");
    expect(
      courseDateModified({
        lastVerifiedAt: "2026-09-01",
        aiAnalyzedAt: "2026-09-15T10:00:00.000Z",
        updatedAt: "2026-08-01T10:00:00.000Z",
      })
    ).toBe("2026-09-15T10:00:00.000Z");
  });
});

describe("courseThumbnailUrl", () => {
  it("uses YouTube's thumbnail for single videos only", () => {
    expect(courseThumbnailUrl(base)).toBe("https://i.ytimg.com/vi/abc123/hqdefault.jpg");
    expect(courseThumbnailUrl({ youtube: { playlistId: "PL1", channelId: "UC" } })).toBeNull();
    expect(courseThumbnailUrl({})).toBeNull();
  });
});
