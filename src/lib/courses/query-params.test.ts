import { describe, expect, it } from "vitest";
import { clearParamsHref, getParamValues, toggleParamHref } from "./query-params";

describe("getParamValues", () => {
  it("normalizes a single value into an array", () => {
    expect(getParamValues({ category: "programming" }, "category")).toEqual(["programming"]);
  });

  it("passes through an array as-is", () => {
    expect(getParamValues({ category: ["a", "b"] }, "category")).toEqual(["a", "b"]);
  });

  it("returns an empty array for a missing key", () => {
    expect(getParamValues({}, "category")).toEqual([]);
  });
});

describe("toggleParamHref", () => {
  it("adds a value when not selected", () => {
    expect(toggleParamHref("/", {}, "category", "design")).toBe("/?category=design");
  });

  it("removes a value when already selected", () => {
    const href = toggleParamHref("/", { category: "design" }, "category", "design");
    expect(href).toBe("/");
  });

  it("keeps other selected values in the same param", () => {
    const href = toggleParamHref("/", { category: ["design", "music"] }, "category", "wellness");
    expect(href).toBe("/?category=design&category=music&category=wellness");
  });

  it("preserves an unrelated param untouched", () => {
    const href = toggleParamHref("/", { platform: "youtube" }, "category", "design");
    expect(href).toBe("/?platform=youtube&category=design");
  });
});

describe("clearParamsHref", () => {
  it("removes every value for the given key, keeps others", () => {
    const href = clearParamsHref("/", { category: ["a", "b"], platform: "youtube" }, ["category"]);
    expect(href).toBe("/?platform=youtube");
  });

  it("removes multiple keys at once", () => {
    const href = clearParamsHref(
      "/",
      { category: "a", platform: "youtube", q: "test" },
      ["category", "platform"]
    );
    expect(href).toBe("/?q=test");
  });

  it("returns the bare basePath when nothing else remains", () => {
    expect(clearParamsHref("/", { category: "a" }, ["category"])).toBe("/");
  });
});
