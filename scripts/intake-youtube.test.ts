import { describe, expect, it } from "vitest";
import { decideIntake, type Reviewer } from "./intake-youtube";
import type { CourseRecord } from "../src/lib/courses/schema";
import type { VideoItem } from "./enrich-youtube";
import { sampleAnalysis } from "../src/lib/courses/ai-analysis.fixture";

function candidate(id: string, duration: string | null, title = `Vídeo ${id}`, description = "Descripción") {
  const record: CourseRecord = {
    slug: `video-${id}`,
    title,
    platform: "youtube",
    category: "programming",
    sourceUrl: `https://www.youtube.com/watch?v=${id}`,
    freeStatus: "free",
    status: "pending",
    lastVerifiedAt: "2026-09-21",
    youtube: { videoId: id, channelId: "UC1" },
  };
  const video: VideoItem | undefined = duration
    ? { id, snippet: { description, publishedAt: "2025-01-01T00:00:00Z" }, contentDetails: { duration } }
    : undefined;
  return { record, video };
}

const courseDecision = {
  isCourse: true as const,
  reason: "Curso.",
  language: "es" as string | null,
  content: {
    summary: "Curso de Python desde cero con variables y funciones.",
    overview: "Recorre los fundamentos de Python en varios capítulos y ejercicios.",
    highlights: ["Variables"],
    level: null,
    analysis: sampleAnalysis,
  },
};

describe("decideIntake", () => {
  it("rejects short videos without calling the reviewer", async () => {
    let calls = 0;
    const reviewer: Reviewer = async () => {
      calls++;
      return courseDecision;
    };
    const result = await decideIntake([candidate("a", "PT5M")], reviewer);
    expect(calls).toBe(0);
    expect(result.rejected).toEqual([expect.objectContaining({ videoId: "a", source: "prefilter" })]);
    expect(result.approved).toHaveLength(0);
  });

  it("approves what the AI approves and rejects what it rejects", async () => {
    const reviewer: Reviewer = async (input) =>
      input.title.includes("noticia")
        ? { isCourse: false, reason: "Es una noticia." }
        : courseDecision;
    const result = await decideIntake(
      [candidate("a", "PT1H"), candidate("b", "PT30M", "Gran noticia de la semana")],
      reviewer
    );
    expect(result.approved.map((a) => a.record.slug)).toEqual(["video-a"]);
    expect(result.approved[0].decision?.content.summary).toContain("Python");
    expect(result.rejected).toEqual([
      expect.objectContaining({ videoId: "b", reason: "Es una noticia.", source: "ai" }),
    ]);
  });

  it("offers the published catalog, minus the video itself, as related-course candidates", async () => {
    let seen: string[] = [];
    const reviewer: Reviewer = async (input) => {
      seen = (input.catalog ?? []).map((c) => c.slug);
      return courseDecision;
    };
    await decideIntake([candidate("a", "PT1H")], reviewer, [
      { slug: "video-a", title: "Él mismo", category: "programming" },
      { slug: "otro", title: "Otro curso", category: "design" },
      { slug: "python", title: "Python", category: "programming" },
    ]);
    expect(seen).toEqual(["python", "otro"]);
  });

  it("skips (to retry) instead of rejecting when the review errors or the video is missing", async () => {
    const reviewer: Reviewer = async () => {
      throw new Error("rate limited");
    };
    const result = await decideIntake([candidate("a", "PT1H"), candidate("b", null)], reviewer);
    expect(result.skipped).toHaveLength(2);
    expect(result.skipped[0].why).toMatch(/rate limited/);
    expect(result.approved).toHaveLength(0);
    expect(result.rejected).toHaveLength(0);
  });

  it("without an API key, still prefilters but approves the rest with no AI content", async () => {
    const result = await decideIntake([candidate("a", "PT1H"), candidate("b", "PT2M")], "unconfigured");
    expect(result.aiConfigured).toBe(false);
    expect(result.approved).toHaveLength(1);
    expect(result.approved[0].decision).toBeUndefined();
    expect(result.rejected).toHaveLength(1);
  });

  it("skips everything reviewable when the AI is configured but unavailable", async () => {
    const result = await decideIntake([candidate("a", "PT1H"), candidate("b", "PT2M")], "unavailable");
    expect(result.skipped).toHaveLength(1);
    expect(result.rejected).toHaveLength(1);
    expect(result.approved).toHaveLength(0);
  });

  it("rejects a verdict score below 3 and keeps 3 or more", async () => {
    const withScore = (score: number) => ({
      ...courseDecision,
      content: { ...courseDecision.content, analysis: { ...sampleAnalysis, verdict: { ...sampleAnalysis.verdict, score } } },
    });
    const reviewer: Reviewer = async (input) => withScore(input.title.includes("flojo") ? 2 : 3);
    const result = await decideIntake([candidate("a", "PT1H", "Curso flojo"), candidate("b", "PT1H", "Curso bueno")], reviewer);
    expect(result.approved.map((a) => a.record.slug)).toEqual(["video-b"]);
    expect(result.rejected).toEqual([expect.objectContaining({ videoId: "a", source: "ai", reason: expect.stringMatching(/2\/5/) })]);
  });

  it("rejects languages other than Spanish or English, and unknown passes", async () => {
    const reviewer: Reviewer = async (input) => ({
      ...courseDecision,
      language: input.title.includes("Italiano") ? "it" : input.title.includes("English") ? "en" : null,
    });
    const result = await decideIntake(
      [candidate("a", "PT1H", "Corso di Italiano"), candidate("b", "PT1H", "English course"), candidate("c", "PT1H")],
      reviewer
    );
    expect(result.approved.map((a) => a.record.slug)).toEqual(["video-b", "video-c"]);
    expect(result.rejected).toEqual([expect.objectContaining({ videoId: "a", source: "ai" })]);
  });

  it("rejects obvious Portuguese without calling the reviewer, even unconfigured", async () => {
    let calls = 0;
    const reviewer: Reviewer = async () => {
      calls++;
      return courseDecision;
    };
    const portuguese = [
      candidate("a", "PT1H", "CS50x em Português - Aula 1 - C"),
      candidate("b", "PT1H", "Curso de Python", "Neste curso você vai aprender Python."),
    ];
    const result = await decideIntake(portuguese, reviewer);
    expect(calls).toBe(0);
    expect(result.rejected.map((r) => r.source)).toEqual(["prefilter", "prefilter"]);
    expect((await decideIntake(portuguese, "unconfigured")).rejected).toHaveLength(2);
  });

  it("holds single series episodes for a human instead of approving or rejecting them", async () => {
    const reviewer: Reviewer = async () => courseDecision;
    const result = await decideIntake(
      [candidate("a", "PT1H", "Curso de Unity - Clase 3"), candidate("b", "PT1H", "Curso completo de Python 3")],
      reviewer
    );
    expect(result.approved.map((a) => a.record.slug)).toEqual(["video-b"]);
    expect(result.held.map((h) => h.record.slug)).toEqual(["video-a"]);
    expect(result.held[0].decision).toBeDefined();
    expect(result.rejected).toHaveLength(0);
  });
});
