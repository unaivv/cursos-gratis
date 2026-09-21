/**
 * Pure helpers that turn raw YouTube Data API fields into the shapes we
 * store and display (duration, chapters, a clean description excerpt).
 * No I/O — the API calls live in scripts/enrich-youtube.ts.
 */

export type Chapter = { title: string; start?: number };

/** Parses an ISO-8601 duration as returned by `videos.list` (e.g. "PT1H2M3S"). */
export function parseIsoDuration(iso: string): number | null {
  const match = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/.exec(iso);
  if (!match) return null;
  const [, days, hours, minutes, seconds] = match;
  const total =
    Number(days ?? 0) * 86400 +
    Number(hours ?? 0) * 3600 +
    Number(minutes ?? 0) * 60 +
    Number(seconds ?? 0);
  return total > 0 ? total : null;
}

/** "1 h 05 min" / "42 min" — rounded to the minute, Spanish-neutral. */
export function formatDuration(totalSeconds: number): string {
  const totalMinutes = Math.max(1, Math.round(totalSeconds / 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  return minutes === 0 ? `${hours} h` : `${hours} h ${String(minutes).padStart(2, "0")} min`;
}

/** "1:02:03" / "12:34" — for chapter start times. */
export function formatTimestamp(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const ss = String(seconds).padStart(2, "0");
  return hours > 0 ? `${hours}:${String(minutes).padStart(2, "0")}:${ss}` : `${minutes}:${ss}`;
}

// A line like "0:00 Intro", "01:02:03 - Variables" or "(12:30) Loops".
const CHAPTER_LINE = /^[(\[]?(\d{1,2}(?::\d{2}){1,2})[)\]]?\s*[-–—:.)]?\s+(.+)$/;

function timestampToSeconds(stamp: string): number {
  const parts = stamp.split(":").map(Number);
  return parts.reduce((acc, part) => acc * 60 + part, 0);
}

/**
 * Extracts chapters from a video description. YouTube only treats it as
 * a chapter list when it starts at 0:00 and has at least 3 entries with
 * increasing timestamps — we apply the same rule so random timestamps in
 * a description don't become a fake syllabus.
 */
export function parseChapters(description: string): Chapter[] {
  const chapters: Chapter[] = [];
  for (const rawLine of description.split(/\r?\n/)) {
    const match = CHAPTER_LINE.exec(rawLine.trim());
    if (!match) continue;
    const title = match[2].trim().slice(0, 120);
    if (!title) continue;
    chapters.push({ title, start: timestampToSeconds(match[1]) });
  }
  if (chapters.length < 3 || chapters[0].start !== 0) return [];
  for (let i = 1; i < chapters.length; i++) {
    if ((chapters[i].start ?? 0) <= (chapters[i - 1].start ?? 0)) return [];
  }
  return chapters;
}

const URL_PATTERN = /https?:\/\/\S+/g;

/**
 * A short, attributable excerpt of the author's own description: the
 * first prose paragraphs, with URLs, chapter-timestamp lines, hashtags
 * and social/promo lines dropped. Returns null when nothing readable is
 * left, so callers can skip the section entirely.
 */
export function descriptionExcerpt(description: string, maxLength = 400): string | null {
  const paragraphs: string[] = [];
  for (const block of description.split(/\r?\n\s*\r?\n/)) {
    const lines = block
      .split(/\r?\n/)
      .map((line) => line.replace(URL_PATTERN, "").trim())
      .filter((line) => line && !CHAPTER_LINE.test(line) && !/^#/.test(line) && !/^[-–—•*]+$/.test(line));
    const text = lines.join(" ").replace(/\s+/g, " ").trim();
    // Skip fragments too short to be real prose ("Suscríbete:", "Sígueme en").
    if (text.length >= 40) paragraphs.push(text);
  }
  const joined = paragraphs.join("\n\n");
  if (!joined) return null;
  if (joined.length <= maxLength) return joined;
  const cut = joined.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
