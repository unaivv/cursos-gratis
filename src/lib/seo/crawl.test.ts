import { describe, expect, it } from "vitest";
import robots from "@/app/robots";

type Rule = { userAgent?: string | string[]; allow?: string | string[]; disallow?: string | string[] };

const list = <T,>(v: T | T[] | undefined): T[] => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

/** Google's robots.txt path matching: `*` wildcard, trailing `$` anchor. */
function matches(pattern: string, path: string): boolean {
  const anchored = pattern.endsWith("$");
  const body = (anchored ? pattern.slice(0, -1) : pattern)
    .split("*")
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
    .join(".*");
  return new RegExp(`^${body}${anchored ? "$" : ""}`).test(path);
}

/** Longest matching pattern wins; allow wins a tie (Google's precedence). */
function blocked(rule: Rule, path: string): boolean {
  const longest = (patterns: string[]) => Math.max(-1, ...patterns.filter((p) => matches(p, path)).map((p) => p.length));
  return longest(list(rule.disallow)) > longest(list(rule.allow));
}

const rules = list<Rule>(robots().rules);
const groups = {
  "*": rules.find((r) => list(r.userAgent).includes("*"))!,
  "AI crawlers": rules.find((r) => list(r.userAgent).includes("GPTBot"))!,
};

describe.each(Object.entries(groups))("robots rules for %s", (_name, rule) => {
  it.each([
    "/?category=programming",
    "/?platform=youtube",
    "/?category=design&platform=youtube",
    "/programming?platform=udemy",
    "/?utm_source=x&category=programming",
    "/admin",
  ])("blocks %s", (path) => {
    expect(blocked(rule, path)).toBe(true);
  });

  it.each([
    "/",
    "/programming",
    "/programming/curso-de-python-abc123",
    "/buscar",
    "/buscar?q=python",
    "/?utm_source=newsletter&utm_medium=email",
    "/programming?utm_source_platform=x",
  ])("allows %s", (path) => {
    expect(blocked(rule, path)).toBe(false);
  });
});
