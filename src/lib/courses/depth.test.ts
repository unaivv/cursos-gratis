import { describe, expect, it } from "vitest";
import { isThinCourse } from "./depth";
import type { CourseRecord } from "./schema";

const base: CourseRecord = {
  slug: "x",
  title: "X",
  platform: "udemy",
  category: "programming",
  sourceUrl: "https://example.com",
  freeStatus: "free",
  status: "published",
  lastVerifiedAt: "2026-01-01",
};

describe("isThinCourse", () => {
  it("is thin with only the base fields", () => {
    expect(isThinCourse(base)).toBe(true);
  });

  it("is not thin with any real extra content", () => {
    expect(isThinCourse({ ...base, editorNote: "Vale la pena." })).toBe(false);
    expect(isThinCourse({ ...base, chapters: [{ title: "Intro" }] })).toBe(false);
    expect(isThinCourse({ ...base, durationSeconds: 600 })).toBe(false);
    expect(isThinCourse({ ...base, description: "Texto" })).toBe(false);
  });
});
