import { describe, expect, it } from "vitest";
import {
  ACCENT_FROM,
  ACCENT_TO,
  escapeLike,
  likePatterns,
  matchingCategorySlugs,
  normalizeSearchText,
  rankSearchResults,
  searchWords,
} from "./search";

describe("normalizeSearchText", () => {
  it("lowercases and folds Spanish accents", () => {
    expect(normalizeSearchText("Programación DISEÑO Pingüino")).toBe("programacion diseno pinguino");
  });

  it("keeps the SQL translate() maps aligned character by character", () => {
    expect([...ACCENT_FROM].length).toBe([...ACCENT_TO].length);
  });
});

describe("escapeLike", () => {
  it("escapes LIKE wildcards and the escape character", () => {
    expect(escapeLike("50%_off\\x")).toBe("50\\%\\_off\\\\x");
  });
});

describe("searchWords", () => {
  it("returns no words for a blank query", () => {
    expect(searchWords("   ")).toEqual([]);
  });

  it("splits into normalized, de-duplicated words without edge punctuation", () => {
    expect(searchWords("  Claude, programación claude ")).toEqual([["claude"], ["programacion"]]);
  });

  it("adds the intended word for known misspellings, keeping the original", () => {
    expect(searchWords("Cloude")).toEqual([["cloude", "claude"]]);
    expect(searchWords("Claudia code")).toEqual([["claudia", "claude"], ["code"]]);
  });

  it("ignores inherited object keys as aliases", () => {
    expect(searchWords("constructor")).toEqual([["constructor"]]);
  });

  it("caps the number of words", () => {
    expect(searchWords("a b c d e f g h")).toHaveLength(6);
  });
});

describe("likePatterns", () => {
  it("wraps each alternative in escaped substring wildcards", () => {
    expect(likePatterns(["claude", "c_d"])).toEqual(["%claude%", "%c\\_d%"]);
  });
});

describe("matchingCategorySlugs", () => {
  const categories = [
    { slug: "design", name: "Diseño" },
    { slug: "programming", name: "Programación" },
  ];

  it("matches category names accent-insensitively", () => {
    expect(matchingCategorySlugs(["diseno"], categories)).toEqual(["design"]);
    expect(matchingCategorySlugs(["programacion"], categories)).toEqual(["programming"]);
    expect(matchingCategorySlugs(["unity"], categories)).toEqual([]);
  });
});

describe("rankSearchResults", () => {
  it("puts courses with more query words in the title first, then slug order", () => {
    const results = [
      { slug: "a-summary-only", title: "Programar con agentes" },
      { slug: "c-claude-code", title: "Claude Code desde cero" },
      { slug: "b-claude", title: "Curso de Claude" },
    ];
    const ranked = rankSearchResults(results, searchWords("claude code"));
    expect(ranked.map((r) => r.slug)).toEqual(["c-claude-code", "b-claude", "a-summary-only"]);
  });
});
