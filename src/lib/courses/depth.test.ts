import { describe, expect, it } from "vitest";
import { isIndexableCourse, MIN_EDITOR_NOTE_CHARS } from "./depth";
import { sampleAnalysis } from "./ai-analysis.fixture";
import type { CourseRecord } from "./schema";

const base: CourseRecord = {
  slug: "x",
  title: "X",
  platform: "youtube",
  category: "programming",
  sourceUrl: "https://example.com",
  freeStatus: "free",
  status: "published",
  lastVerifiedAt: "2026-01-01",
};

describe("isIndexableCourse", () => {
  it("is not indexable with only source data and a short summary", () => {
    expect(isIndexableCourse(base)).toBe(false);
    expect(
      isIndexableCourse({
        ...base,
        description: "Texto",
        durationSeconds: 600,
        chapters: [{ title: "Intro" }],
        aiSummary: "Resumen corto del curso.",
        editorNote: "Vale la pena.",
      })
    ).toBe(false);
  });

  it("becomes indexable with the editorial analysis", () => {
    expect(isIndexableCourse({ ...base, aiAnalysis: sampleAnalysis })).toBe(true);
  });

  it("becomes indexable with a substantial hand-written editor note", () => {
    expect(isIndexableCourse({ ...base, editorNote: "a".repeat(MIN_EDITOR_NOTE_CHARS) })).toBe(true);
  });
});
