import { describe, expect, it } from "vitest";
import { aiContentSchema } from "./ai-content";

const valid = {
  id: "11111111-1111-4111-8111-111111111111",
  summary: "Introducción a Python: variables, funciones y estructuras de datos.",
  overview: "Recorre los fundamentos de Python en 12 capítulos, desde la instalación hasta funciones.",
  highlights: ["Variables", "Funciones"],
  level: "principiante" as const,
};

describe("aiContentSchema", () => {
  it("accepts well-formed content, including null level and no highlights", () => {
    expect(aiContentSchema.safeParse(valid).success).toBe(true);
    expect(aiContentSchema.safeParse({ ...valid, level: null, highlights: [] }).success).toBe(true);
  });

  it("rejects an oversized summary, too many highlights or an unknown level", () => {
    expect(aiContentSchema.safeParse({ ...valid, summary: "x".repeat(201) }).success).toBe(false);
    expect(aiContentSchema.safeParse({ ...valid, highlights: ["a1", "b2", "c3", "d4", "e5", "f6"] }).success).toBe(false);
    expect(aiContentSchema.safeParse({ ...valid, level: "experto" }).success).toBe(false);
  });

  it("rejects a non-uuid id", () => {
    expect(aiContentSchema.safeParse({ ...valid, id: "abc" }).success).toBe(false);
  });
});
