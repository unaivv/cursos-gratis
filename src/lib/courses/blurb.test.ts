import { describe, expect, it } from "vitest";
import { courseBlurb } from "./blurb";

describe("courseBlurb", () => {
  it("includes the author when present", () => {
    expect(courseBlurb({ platform: "youtube", author: "freeCodeCamp" }, "Programación")).toBe(
      "Curso gratuito de Programación en YouTube, impartido por freeCodeCamp."
    );
  });

  it("omits the author clause when missing", () => {
    expect(courseBlurb({ platform: "udemy" }, "Negocios")).toBe(
      "Curso gratuito de Negocios en Udemy."
    );
  });

  it("adds lesson count and duration when known", () => {
    expect(
      courseBlurb(
        { platform: "youtube", author: "midudev", lessonCount: 24, durationSeconds: 7200 },
        "Programación"
      )
    ).toBe(
      "Curso gratuito de Programación en YouTube, impartido por midudev. 24 lecciones · 2 h de contenido."
    );
    expect(courseBlurb({ platform: "youtube", durationSeconds: 2700 }, "Diseño")).toBe(
      "Curso gratuito de Diseño en YouTube. 45 min de contenido."
    );
  });
});
