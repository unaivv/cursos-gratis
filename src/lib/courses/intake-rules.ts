/**
 * Deterministic intake heuristics for new YouTube videos, kept free of
 * I/O so they're cheap to run before (and after) the AI review in
 * scripts/intake-youtube.ts.
 */

/** Languages the catalog lists: Spanish courses, plus English ones. */
export const SUPPORTED_LANGUAGES = ["es", "en"] as const;

/** Lowest AI verdict score (1-5) a video needs to reach the approval queue. */
export const MIN_INTAKE_SCORE = 3;

export function isSupportedLanguage(code: string | null | undefined): boolean {
  if (!code) return true; // unknown: let the rest of the review decide
  const base = code.trim().toLowerCase().split(/[-_]/)[0];
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(base);
}

// Unambiguous Portuguese markers. "Aula N" only counts in the title: in
// Spanish "aula" is a classroom, and a description may mention one.
// `\b` is ASCII-only in JS, so whole words are delimited by letters instead.
const word = (source: string) => new RegExp(`(?<!\\p{L})(?:${source})(?!\\p{L})`, "iu");
const PORTUGUESE_ANYWHERE = [word("portugu[eê]s"), word("voc[eê]s?"), word("mestrado")];
const PORTUGUESE_TITLE_ONLY = [word("aula\\s*#?\\s*\\d+"), word("\\p{L}+(?:ção|ções)")];

/** "pt" when the title/description is obviously Portuguese, else null. */
export function detectUnsupportedLanguage(title: string, description = ""): string | null {
  if (PORTUGUESE_TITLE_ONLY.some((re) => re.test(title))) return "pt";
  if (PORTUGUESE_ANYWHERE.some((re) => re.test(title) || re.test(description))) return "pt";
  return null;
}

// "Clase 3", "Día 1", "Episodio 2", "Lesson 4", "Aula 2"... A 1-3 digit
// number right after the word (so years like "2026" never count) that isn't
// a version ("3.13") or a range ("Clase 1 a 20" is the whole series).
const EPISODE_WORDS =
  "clase|d[ií]a|episodio|ep\\.?|parte|part|tema|cap[ií]tulo|chapter|lesson|lecci[oó]n|aula|episode|sesi[oó]n";
const EPISODE = new RegExp(
  `(?:^|[^\\p{L}])(?:${EPISODE_WORDS})\\s*(?:n[º°o]\\.?\\s*)?#?\\s*\\d{1,3}(?![\\d.,])(?!\\s*(?:a|al|-|–|to|y)\\s*\\d)`,
  "iu"
);
// "#1" on its own, e.g. "CURSO GRATIS #1".
const HASH_NUMBER = /(?:^|\s)#\d{1,3}(?!\d)/;

/**
 * True for a title that looks like a single numbered episode of a series.
 * Those stay for a human to decide (they may group the series) instead of
 * being queued as a standalone course.
 */
export function isSeriesEpisode(title: string): boolean {
  return EPISODE.test(title) || HASH_NUMBER.test(title);
}
