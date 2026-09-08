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
});
