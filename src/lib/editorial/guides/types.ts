/**
 * Long-form guides (/guias). Deliberately generic about *which* courses
 * to take — the live course list for a guide is picked from the database
 * at render time (see lib/editorial/guide-courses.ts), so the advice
 * never goes stale when the catalog changes.
 */
export type GuideLink = { href: string; label: string };

export type GuideSection = {
  heading: string;
  paragraphs?: string[];
  steps?: string[];
  /** Render `steps` as a numbered list (an order that matters). */
  ordered?: boolean;
  /** Internal links shown under the section ("Sigue por aquí"). */
  links?: GuideLink[];
};

export type GuideFaq = { question: string; answer: string };

/**
 * - `ruta`: a learning path for a subject, in stages.
 * - `metodo`: how to study (finish a course, take notes, plan, projects…).
 * - `eleccion`: how to choose courses and platforms.
 */
export type GuideKind = "ruta" | "metodo" | "eleccion";

export type Guide = {
  slug: string;
  kind: GuideKind;
  title: string;
  /** A few words for navigation (footer, compact lists). */
  shortTitle: string;
  description: string;
  /** The category this guide is about; its page links back here. */
  categorySlug?: string;
  /**
   * How to pick catalog courses for this guide at render time: the
   * categories to look in (defaults to `categorySlug`) and keywords to
   * prefer, matched against title, summary and highlights.
   */
  courseMatch?: { categories?: string[]; keywords?: string[] };
  /** ISO dates: first publication and last substantive edit. */
  published: string;
  updated: string;
  intro: string;
  sections: GuideSection[];
  /** Questions readers ask about the topic — rendered at the end and as FAQPage JSON-LD. */
  faq?: GuideFaq[];
  /** Hand-picked follow-up guides (slugs); filled up automatically if short. */
  related?: string[];
};

export const GUIDE_KIND_LABEL: Record<GuideKind, string> = {
  ruta: "Ruta de aprendizaje",
  metodo: "Método de estudio",
  eleccion: "Elegir bien",
};
