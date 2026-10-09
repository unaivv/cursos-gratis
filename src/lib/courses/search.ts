/**
 * Pure helpers for the /buscar text search (src/lib/courses/read.ts
 * `searchCourses`). Kept free of DB access so the matching rules are unit
 * tested; the query itself stays a plain parameterized LIKE.
 *
 * Rules, deliberately simple (no fuzzy matching, no extensions):
 *   - case- and accent-insensitive: both the query and the columns are
 *     lowercased and run through the same accent fold (`ACCENT_FROM` →
 *     `ACCENT_TO`, applied in SQL with `translate()`),
 *   - multi-word queries match courses containing EVERY word, each in any
 *     searched field ("claude programación" finds a Claude course in the
 *     Programación category) — a superset of the old contiguous match,
 *   - a few observed misspellings of popular topics also match the
 *     intended word (see `SEARCH_ALIASES`).
 */

/** Accented characters folded to their base letter, position by position. */
export const ACCENT_FROM = "áàäâãéèëêíìïîóòöôõúùüûñç";
export const ACCENT_TO = "aaaaaeeeeiiiiooooouuuunc";

/** Words beyond this are ignored: a search box query, not a document. */
const MAX_WORDS = 6;

/**
 * Misspellings seen in real internal searches (GA4), mapped to the word
 * they mean. The original word is still searched too, so an author named
 * "Claudia" keeps matching. Keep this list short and evidence-based.
 */
export const SEARCH_ALIASES: Record<string, string> = {
  cloude: "claude",
  claudia: "claude",
  clode: "claude",
};

/** Lowercase + accent fold, the same transformation applied to columns in SQL. */
export function normalizeSearchText(text: string): string {
  let out = "";
  for (const char of text.toLowerCase()) {
    const index = ACCENT_FROM.indexOf(char);
    out += index === -1 ? char : ACCENT_TO[index];
  }
  return out;
}

/** Escapes LIKE wildcards so a user's "%" or "_" is matched literally. */
export function escapeLike(text: string): string {
  return text.replace(/[\\%_]/g, (char) => `\\${char}`);
}

/**
 * Splits a raw query into normalized words, each with its accepted
 * alternatives (the word itself plus any alias). Empty for a blank query.
 */
export function searchWords(query: string): string[][] {
  const words = normalizeSearchText(query)
    .split(/\s+/)
    .map((word) => word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ""))
    .filter((word) => word.length > 0);
  const unique = [...new Set(words)].slice(0, MAX_WORDS);
  return unique.map((word) => {
    const alias = Object.hasOwn(SEARCH_ALIASES, word) ? SEARCH_ALIASES[word] : undefined;
    return alias ? [word, alias] : [word];
  });
}

/** `%word%` LIKE patterns for one word's alternatives, wildcards escaped. */
export function likePatterns(alternatives: string[]): string[] {
  return alternatives.map((word) => `%${escapeLike(word)}%`);
}

/** Category slugs whose Spanish name contains any of the alternatives. */
export function matchingCategorySlugs(
  alternatives: string[],
  categories: { slug: string; name: string }[]
): string[] {
  return categories
    .filter((category) => {
      const name = normalizeSearchText(category.name);
      return alternatives.some((word) => name.includes(word));
    })
    .map((category) => category.slug);
}

/**
 * Orders results so courses whose title contains more of the query words
 * come first (a "Claude Code" course before one that only mentions Claude
 * in its summary); ties keep slug order.
 */
export function rankSearchResults<T extends { slug: string; title: string }>(
  results: T[],
  words: string[][]
): T[] {
  const titleHits = (course: T) => {
    const title = normalizeSearchText(course.title);
    return words.filter((alternatives) => alternatives.some((word) => title.includes(word))).length;
  };
  return results
    .map((course) => ({ course, hits: titleHits(course) }))
    .sort((a, b) => b.hits - a.hits || a.course.slug.localeCompare(b.course.slug))
    .map(({ course }) => course);
}
