import { describe, expect, it } from "vitest";
import { COURSES_PER_PAGE, pageCount, pageHref, pageRange, pageSlice, parsePageParam } from "./pagination";

describe("parsePageParam", () => {
  it("treats a missing param as page 1", () => {
    expect(parsePageParam(undefined)).toBe(1);
  });

  it("accepts canonical positive integers", () => {
    expect(parsePageParam("1")).toBe(1);
    expect(parsePageParam("2")).toBe(2);
    expect(parsePageParam("37")).toBe(37);
  });

  it("rejects anything that isn't a canonical positive integer", () => {
    for (const value of ["", "0", "-1", "01", "1.5", "2e1", " 2", "abc", "9999999999999999999"]) {
      expect(parsePageParam(value)).toBeNull();
    }
  });

  it("rejects a repeated param", () => {
    expect(parsePageParam(["2", "3"])).toBeNull();
  });
});

describe("pageCount", () => {
  it("is at least 1, even for an empty list", () => {
    expect(pageCount(0)).toBe(1);
  });

  it("rounds up partial pages", () => {
    expect(pageCount(COURSES_PER_PAGE)).toBe(1);
    expect(pageCount(COURSES_PER_PAGE + 1)).toBe(2);
    expect(pageCount(10, 3)).toBe(4);
  });
});

describe("pageSlice", () => {
  const items = Array.from({ length: 10 }, (_, i) => i);

  it("returns the items of the requested page", () => {
    expect(pageSlice(items, 1, 4)).toEqual([0, 1, 2, 3]);
    expect(pageSlice(items, 2, 4)).toEqual([4, 5, 6, 7]);
  });

  it("returns a short last page", () => {
    expect(pageSlice(items, 3, 4)).toEqual([8, 9]);
  });

  it("returns nothing past the end", () => {
    expect(pageSlice(items, 4, 4)).toEqual([]);
  });
});

describe("pageRange", () => {
  it("lists every page when there are few", () => {
    expect(pageRange(1, 1)).toEqual([1]);
    expect(pageRange(3, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("collapses distant pages into ellipses around the current one", () => {
    expect(pageRange(6, 11)).toEqual([1, "ellipsis", 5, 6, 7, "ellipsis", 11]);
  });

  it("keeps the edges compact on the first and last pages", () => {
    expect(pageRange(1, 11)).toEqual([1, 2, "ellipsis", 11]);
    expect(pageRange(11, 11)).toEqual([1, "ellipsis", 10, 11]);
  });

  it("shows a single hidden page instead of an ellipsis", () => {
    // Page 2 would be the only page behind an ellipsis — show it instead.
    expect(pageRange(4, 11)).toEqual([1, 2, 3, 4, 5, "ellipsis", 11]);
  });
});

describe("pageHref", () => {
  it("drops the param on page 1", () => {
    expect(pageHref("/programming", {}, 1)).toBe("/programming");
    expect(pageHref("/programming", { page: "3" }, 1)).toBe("/programming");
  });

  it("sets the page, replacing any previous one", () => {
    expect(pageHref("/programming", { page: "3" }, 2)).toBe("/programming?page=2");
  });

  it("keeps the other params", () => {
    expect(pageHref("/programming", { platform: ["youtube", "udemy"] }, 2)).toBe(
      "/programming?platform=youtube&platform=udemy&page=2"
    );
  });
});
