import { ANALYSIS_VERSION, type CourseAnalysis } from "./ai-analysis";

/** A minimal valid analysis, shared by unit tests. Not used at runtime. */
export const sampleAnalysis: CourseAnalysis = {
  version: ANALYSIS_VERSION,
  audience: {
    forWho: ["Personas que empiezan a programar y quieren una base en Python."],
    notFor: ["Quien ya domina Python y busca temas avanzados."],
  },
  prerequisites: [],
  outcomes: ["Escribir programas sencillos con variables y funciones.", "Usar listas y diccionarios."],
  syllabus: [
    { title: "Primeros pasos", summary: "Instalación del entorno y primeras instrucciones." },
    { title: "Estructuras de datos", summary: "Listas, diccionarios y cómo recorrerlos." },
  ],
  strengths: ["Recorrido ordenado con capítulos claros."],
  weaknesses: ["La descripción no menciona ejercicios propuestos."],
  studyPlan: {
    weeks: 3,
    hoursPerWeek: 2,
    steps: ["Semana 1: capítulos de introducción.", "Semana 2 y 3: estructuras de datos y repaso."],
  },
  tips: ["Teclea el código de cada capítulo antes de pasar al siguiente.", "Anota las dudas con la marca de tiempo."],
  related: [{ slug: "otro-curso", relation: "despues", reason: "Profundiza en lo visto aquí." }],
  verdict: {
    summary: "Una introducción ordenada y completa a Python para quien empieza desde cero.",
    recommendation: "recomendado",
    score: 4,
  },
  faq: [
    { question: "¿Necesito saber programar?", answer: "No, empieza desde la instalación." },
    { question: "¿Cuánto se tarda?", answer: "Unas tres semanas a dos horas por semana." },
  ],
};
