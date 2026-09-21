import { describe, expect, it } from "vitest";
import {
  descriptionExcerpt,
  formatDuration,
  formatTimestamp,
  parseChapters,
  parseIsoDuration,
} from "./youtube-meta";

describe("parseIsoDuration", () => {
  it("parses hours, minutes and seconds", () => {
    expect(parseIsoDuration("PT1H2M3S")).toBe(3723);
    expect(parseIsoDuration("PT45M")).toBe(2700);
    expect(parseIsoDuration("PT30S")).toBe(30);
  });

  it("parses day-long streams", () => {
    expect(parseIsoDuration("P1DT2H")).toBe(93600);
  });

  it("returns null for zero-length or invalid input", () => {
    expect(parseIsoDuration("P0D")).toBeNull();
    expect(parseIsoDuration("nope")).toBeNull();
  });
});

describe("formatDuration", () => {
  it("formats minutes only under an hour", () => {
    expect(formatDuration(2700)).toBe("45 min");
  });

  it("formats hours and padded minutes", () => {
    expect(formatDuration(3900)).toBe("1 h 05 min");
    expect(formatDuration(7200)).toBe("2 h");
  });
});

describe("formatTimestamp", () => {
  it("formats with and without hours", () => {
    expect(formatTimestamp(754)).toBe("12:34");
    expect(formatTimestamp(3723)).toBe("1:02:03");
  });
});

describe("parseChapters", () => {
  it("extracts a valid chapter list", () => {
    const description = "Curso completo\n\n0:00 Introducción\n05:30 - Variables\n(1:02:03) Funciones";
    expect(parseChapters(description)).toEqual([
      { title: "Introducción", start: 0 },
      { title: "Variables", start: 330 },
      { title: "Funciones", start: 3723 },
    ]);
  });

  it("ignores lists that don't start at 0:00, are too short, or aren't increasing", () => {
    expect(parseChapters("1:00 A\n2:00 B\n3:00 C")).toEqual([]);
    expect(parseChapters("0:00 A\n1:00 B")).toEqual([]);
    expect(parseChapters("0:00 A\n5:00 B\n2:00 C")).toEqual([]);
  });
});

describe("descriptionExcerpt", () => {
  it("keeps prose and drops urls, chapters and hashtags", () => {
    const description = [
      "En este curso aprenderás los fundamentos de Python desde cero, paso a paso.",
      "",
      "Sígueme: https://twitter.com/x",
      "",
      "0:00 Intro\n1:00 Tipos\n2:00 Bucles",
      "",
      "#python #curso",
    ].join("\n");
    expect(descriptionExcerpt(description)).toBe(
      "En este curso aprenderás los fundamentos de Python desde cero, paso a paso."
    );
  });

  it("truncates long text at a word boundary", () => {
    const long = "palabra ".repeat(100);
    const excerpt = descriptionExcerpt(long, 100);
    expect(excerpt?.endsWith("…")).toBe(true);
    expect(excerpt!.length).toBeLessThanOrEqual(101);
  });

  it("returns null when nothing readable remains", () => {
    expect(descriptionExcerpt("https://example.com\n\n#tag")).toBeNull();
  });
});
