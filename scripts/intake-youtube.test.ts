import { describe, expect, it } from "vitest";
import { decideIntake, type Reviewer } from "./intake-youtube";
import type { CourseRecord } from "../src/lib/courses/schema";
import type { VideoItem } from "./enrich-youtube";
import { sampleAnalysis } from "../src/lib/courses/ai-analysis.fixture";

function candidate(id: string, duration: string | null, title = `Vídeo ${id}`) {
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
    ? { id, snippet: { description: "Descripción", publishedAt: "2025-01-01T00:00:00Z" }, contentDetails: { duration } }
    : undefined;
  return { record, video };
}

const courseDecision = {
  isCourse: true as const,
  reason: "Curso.",
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
});
