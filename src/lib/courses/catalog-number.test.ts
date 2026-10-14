import { describe, expect, it } from "vitest";
import { catalogNumber, catalogNumbers } from "./catalog-number";

describe("catalogNumbers", () => {
  it("numbers slugs by sorted position under the subject code", () => {
    const numbers = catalogNumbers("programming", ["c", "a", "b"]);
    expect(numbers.get("a")).toBe("005.001");
    expect(numbers.get("c")).toBe("005.003");
  });

  it("matches catalogNumber for every slug", () => {
    const slugs = ["react", "go", "rust", "python"];
    const numbers = catalogNumbers("business", slugs);
    for (const slug of slugs) expect(numbers.get(slug)).toBe(catalogNumber("business", slug, slugs));
  });
});
