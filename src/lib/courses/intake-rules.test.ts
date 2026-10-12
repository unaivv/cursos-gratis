import { describe, expect, it } from "vitest";
import { detectUnsupportedLanguage, isSeriesEpisode, isSupportedLanguage } from "./intake-rules";

describe("isSeriesEpisode", () => {
  it.each([
    "CS50x em Português - Aula 0 - Scratch",
    "CS50x em Português - Aula 1 - C",
    "(05/01/2026) - Mestrado: Machine Learning - Paulo Orenstein - Aula 01",
    "Cómo Ser SEO para PRINCIPIANTES | CURSO GRATIS #1",
    "Clase 3: bucles en JavaScript",
    "Curso de Unity - Clase 1",
    "30 días de Python - Día 1",
    "Episodio 2 | Git y GitHub",
    "Ep. 4 - React hooks",
    "Excel avanzado Parte 1",
    "Tema 1 - Introducción a la contabilidad",
    "Capítulo 1: Fundamentos",
    "Lesson 4 - Arrays",
    "Part 2: Deploying to production",
    "Docker desde cero (capítulo 1)",
    "Lección 5 - Variables",
  ])("flags %s", (title) => {
    expect(isSeriesEpisode(title)).toBe(true);
  });

  it.each([
    "Curso completo de Python 3",
    "Python 3.13: novedades",
    "Revit 2026 desde cero",
    "Curso de JavaScript 2026",
    "Clase 1 a 20 del curso de Java completo",
    "Aprende Python en 1 día",
    "Curso de HTML5 y CSS3",
    "Top 10 extensiones de VS Code",
    "Clases de inglés para principiantes",
    "Curso de C# desde cero",
  ])("does not flag %s", (title) => {
    expect(isSeriesEpisode(title)).toBe(false);
  });
});

describe("detectUnsupportedLanguage", () => {
  it.each([
    ["CS50x em Português - Aula 0 - Scratch", ""],
    ["(05/01/2026) - Mestrado: Machine Learning - Paulo Orenstein - Aula 01", ""],
    ["Curso de Python para iniciantes", "Neste curso você vai aprender Python do zero."],
    ["Introdução à programação", ""],
  ])("flags Portuguese: %s", (title, description) => {
    expect(detectUnsupportedLanguage(title, description)).toBe("pt");
  });

  it.each([
    ["Curso completo de Python 3", "Aprende Python desde cero con ejercicios."],
    ["Complete Python course for beginners", "Learn Python from scratch."],
    ["Programación en C desde cero", "Clase grabada en el aula virtual."],
    ["Introducción a la programación", ""],
  ])("lets Spanish/English through: %s", (title, description) => {
    expect(detectUnsupportedLanguage(title, description)).toBeNull();
  });
});

describe("isSupportedLanguage", () => {
  it("accepts Spanish, English and unknown; rejects the rest", () => {
    expect(isSupportedLanguage("es")).toBe(true);
    expect(isSupportedLanguage("en-US")).toBe(true);
    expect(isSupportedLanguage(null)).toBe(true);
    expect(isSupportedLanguage("pt")).toBe(false);
    expect(isSupportedLanguage("pt-BR")).toBe(false);
  });
});
