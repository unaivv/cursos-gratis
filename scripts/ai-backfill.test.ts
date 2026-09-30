import { describe, expect, it } from "vitest";
import { hasGrounding, parseArgs, selectBackfillTargets } from "./ai-backfill";
import { ANALYSIS_VERSION } from "../src/lib/courses/ai-analysis";
import { sampleAnalysis } from "../src/lib/courses/ai-analysis.fixture";

const longDescription = "Curso completo de Python desde cero con variables, funciones, listas y proyectos al final.";

function row(slug: string, extra: Partial<Parameters<typeof selectBackfillTargets>[0][number]> = {}) {
  return {
    slug,
    status: "published" as "published" | "pending",
    category: "programming",
    description: longDescription,
    chapters: null,
    aiAnalysis: null as unknown,
    ...extra,
  };
}

describe("parseArgs", () => {
  it("reads flags and values", () => {
    const options = parseArgs(["--force", "--limit", "10", "--slug", "a", "--slug", "b", "--category", "design", "--dry-run"]);
    expect(options).toMatchObject({ force: true, limit: 10, slugs: ["a", "b"], category: "design", dryRun: true });
  });

  it("rejects unknown options and missing values", () => {
    expect(() => parseArgs(["--nope"])).toThrow(/unknown/);
    expect(() => parseArgs(["--limit"])).toThrow(/needs a value/);
  });
});

describe("hasGrounding", () => {
  it("needs chapters or a meaningful description", () => {
    expect(hasGrounding({ description: null, chapters: null })).toBe(false);
    expect(hasGrounding({ description: "Suscríbete https://x.com", chapters: null })).toBe(false);
    expect(hasGrounding({ description: longDescription, chapters: null })).toBe(true);
    expect(hasGrounding({ description: null, chapters: [{ title: "a" }, { title: "b" }, { title: "c" }] })).toBe(true);
  });
});

describe("selectBackfillTargets", () => {
  const base = parseArgs([]);

  it("skips courses with a current analysis unless forced, and re-does outdated ones", () => {
    const rows = [
      row("done", { aiAnalysis: sampleAnalysis }),
      row("old", { aiAnalysis: { ...sampleAnalysis, version: ANALYSIS_VERSION - 1 } }),
      row("new"),
    ];
    expect(selectBackfillTargets(rows, base).targets.map((r) => r.slug)).toEqual(["old", "new"]);
    expect(selectBackfillTargets(rows, { ...base, force: true }).targets).toHaveLength(3);
  });

  it("leaves pending courses out unless asked, and reports ungrounded ones", () => {
    const rows = [row("pending", { status: "pending" }), row("udemy", { description: null }), row("ok")];
    const result = selectBackfillTargets(rows, base);
    expect(result.targets.map((r) => r.slug)).toEqual(["ok"]);
    expect(result.ungrounded.map((r) => r.slug)).toEqual(["udemy"]);
    expect(selectBackfillTargets(rows, { ...base, includePending: true }).targets).toHaveLength(2);
  });

  it("applies category, slug and limit filters", () => {
    const rows = [row("a"), row("b"), row("c", { category: "design" })];
    expect(selectBackfillTargets(rows, { ...base, category: "design" }).targets.map((r) => r.slug)).toEqual(["c"]);
    expect(selectBackfillTargets(rows, { ...base, slugs: ["b"] }).targets.map((r) => r.slug)).toEqual(["b"]);
    const limited = selectBackfillTargets(rows, { ...base, limit: 2 });
    expect(limited.targets).toHaveLength(2);
    expect(limited.remaining).toBe(1);
  });
});
