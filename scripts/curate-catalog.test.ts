import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DEFAULT_LIST_FILE, parseArgs, parseCurationList } from "./curate-catalog";

const entry = { slug: "curso-a", reason: "portuguese", title: "Curso A" };

describe("parseCurationList", () => {
  it("accepts the committed default list", () => {
    const list = parseCurationList(JSON.parse(readFileSync(DEFAULT_LIST_FILE, "utf8")));
    expect(list.length).toBeGreaterThan(0);
  });

  it("trims and returns valid entries", () => {
    expect(parseCurationList([{ ...entry, slug: " curso-a " }])).toEqual([entry]);
  });

  it.each([
    ["not an array", { slug: "x" }],
    ["an empty list", []],
    ["a missing slug", [{ reason: "x", title: "y" }]],
    ["an empty slug", [{ ...entry, slug: "  " }]],
  ])("rejects %s", (_label, raw) => {
    expect(() => parseCurationList(raw)).toThrow(/invalid curation list/);
  });

  it("rejects duplicate slugs", () => {
    expect(() => parseCurationList([entry, { ...entry, title: "Otra" }])).toThrow(/duplicate slug.*curso-a/);
  });
});

describe("parseArgs", () => {
  it("is a dry run on the default list unless --apply is passed", () => {
    expect(parseArgs([])).toEqual({ apply: false, file: DEFAULT_LIST_FILE });
    expect(parseArgs(["--apply", "--file", "x.json"])).toEqual({ apply: true, file: "x.json" });
  });

  it("rejects unknown options and a --file without value", () => {
    expect(() => parseArgs(["--force"])).toThrow(/unknown option/);
    expect(() => parseArgs(["--file"])).toThrow(/needs a value/);
  });
});
