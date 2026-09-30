import { CORE_GUIDES } from "./core";
import { METHOD_GUIDES } from "./method";
import { PATH_GUIDES } from "./paths";
import type { Guide, GuideKind } from "./types";

export type { Guide, GuideFaq, GuideKind, GuideLink, GuideSection } from "./types";
export { GUIDE_KIND_LABEL } from "./types";

export const GUIDES: Guide[] = [...PATH_GUIDES, ...CORE_GUIDES, ...METHOD_GUIDES];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}

export function guidesByKind(kind: GuideKind): Guide[] {
  return GUIDES.filter((guide) => guide.kind === kind);
}

/** Every guide about a category — its own routes first, then ones that draw courses from it. */
export function guidesForCategory(categorySlug: string): Guide[] {
  const own = GUIDES.filter((guide) => guide.categorySlug === categorySlug);
  const drawing = GUIDES.filter(
    (guide) => guide.categorySlug !== categorySlug && guide.courseMatch?.categories?.includes(categorySlug)
  );
  return [...own, ...drawing];
}

/** The main starting guide for a category (first learning path about it). */
export function guideForCategory(categorySlug: string): Guide | undefined {
  return guidesForCategory(categorySlug).find((guide) => guide.kind === "ruta") ?? guidesForCategory(categorySlug)[0];
}

/** Hand-picked related guides, topped up with same-kind/same-category ones. */
export function relatedGuides(guide: Guide, count = 4): Guide[] {
  const picked = (guide.related ?? []).map(getGuide).filter((g): g is Guide => Boolean(g) && g!.slug !== guide.slug);
  const extra = GUIDES.filter(
    (g) =>
      g.slug !== guide.slug &&
      !picked.includes(g) &&
      ((guide.categorySlug && g.categorySlug === guide.categorySlug) || g.kind !== guide.kind)
  );
  return [...picked, ...extra].slice(0, count);
}

/** Stable anchor id for a section heading (table of contents). */
export function sectionId(heading: string): string {
  return heading
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function guideWordCount(guide: Guide): number {
  const text = [
    guide.intro,
    ...guide.sections.flatMap((section) => [section.heading, ...(section.paragraphs ?? []), ...(section.steps ?? [])]),
    ...(guide.faq ?? []).flatMap((item) => [item.question, item.answer]),
  ].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

/** At ~200 words per minute, never less than 1. */
export function readingMinutes(guide: Guide): number {
  return Math.max(1, Math.round(guideWordCount(guide) / 200));
}
