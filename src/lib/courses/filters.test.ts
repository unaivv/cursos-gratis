import { describe, expect, it } from "vitest";
import { filterCourses } from "./filters";
import type { CourseRecord } from "./schema";

function course(overrides: Partial<CourseRecord>): CourseRecord {
  return {
    slug: "x",
    title: "X",
    platform: "youtube",
    category: "programming",
    sourceUrl: "https://example.com",
    freeStatus: "free",
    status: "published",
    lastVerifiedAt: "2026-01-01",
    ...overrides,
  };
}

const all = [
  course({ slug: "a", platform: "youtube", category: "programming" }),
  course({ slug: "b", platform: "udemy", category: "programming" }),
  course({ slug: "c", platform: "youtube", category: "music" }),
  course({ slug: "d", platform: "udemy", category: "wellness" }),
];

describe("filterCourses", () => {
  it("returns everything when no filters are set", () => {
    expect(filterCourses(all, { categories: [], platforms: [] })).toHaveLength(4);
  });

  it("filters by a single category", () => {
    const result = filterCourses(all, { categories: ["music"], platforms: [] });
    expect(result.map((c) => c.slug)).toEqual(["c"]);
  });

  it("filters by multiple categories (OR within the dimension)", () => {
    const result = filterCourses(all, { categories: ["music", "wellness"], platforms: [] });
    expect(result.map((c) => c.slug).sort()).toEqual(["c", "d"]);
  });

  it("filters by platform", () => {
    const result = filterCourses(all, { categories: [], platforms: ["udemy"] });
    expect(result.map((c) => c.slug).sort()).toEqual(["b", "d"]);
  });

  it("combines category and platform filters (AND across dimensions)", () => {
    const result = filterCourses(all, { categories: ["programming"], platforms: ["udemy"] });
    expect(result.map((c) => c.slug)).toEqual(["b"]);
  });
});
