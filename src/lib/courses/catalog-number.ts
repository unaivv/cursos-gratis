// Subject codes loosely follow real library classification numbers where
// they line up (005 = computer programming, 650 = business, ...) — flavor
// grounded in an actual convention, not a fabricated system.
const SUBJECT_CODE: Record<string, string> = {
  programming: "005",
  "data-ai": "006",
  design: "700",
  marketing: "650",
  languages: "400",
  business: "330",
  productivity: "158",
  wellness: "613",
  music: "780",
  crafts: "745",
  engineering: "620",
  education: "370",
};

/**
 * Deterministic catalog number for a course card, e.g. "005.002" — the
 * subject code plus its position within the category (stable ordering by
 * slug, so it doesn't reshuffle between builds).
 */
export function catalogNumber(category: string, slug: string, allSlugsInCategory: string[]): string {
  const code = SUBJECT_CODE[category] ?? "000";
  const sorted = [...allSlugsInCategory].sort();
  const index = sorted.indexOf(slug);
  const position = String(index === -1 ? sorted.length + 1 : index + 1).padStart(3, "0");
  return `${code}.${position}`;
}
