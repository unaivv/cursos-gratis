import { toArray, type SearchParamsInput } from "./query-params";

/**
 * Pure helpers for the paginated category listing (`/[category]?page=N`).
 * Page 1 is always the bare URL — `?page=1` is never generated, so each
 * page has exactly one address. Pagination links are plain, followable
 * `<Link>`s: unlike the filter pills, `?page=` is meant to be crawled so
 * every course stays reachable from its category.
 */
export const COURSES_PER_PAGE = 48;

export const PAGE_PARAM = "page";

/**
 * The requested page number, or `null` when the param isn't a canonical
 * positive integer ("01", "1.5", "abc", repeated params...). A missing
 * param is page 1.
 */
export function parsePageParam(value: string | string[] | undefined): number | null {
  if (value === undefined) return 1;
  if (Array.isArray(value)) return null;
  if (!/^[1-9]\d{0,5}$/.test(value)) return null;
  return Number(value);
}

/** Number of pages for `total` items — at least 1, so an empty list still has a page. */
export function pageCount(total: number, perPage: number = COURSES_PER_PAGE): number {
  return Math.max(1, Math.ceil(total / perPage));
}

/** The items shown on 1-based `page`. */
export function pageSlice<T>(items: readonly T[], page: number, perPage: number = COURSES_PER_PAGE): T[] {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
}

export type PageRangeEntry = number | "ellipsis";

/**
 * Compact page list for the pagination nav: first, last, and the current
 * page with one neighbour each side; gaps collapse into an ellipsis, except
 * a gap of a single page, which is shown (an ellipsis hiding one number
 * saves nothing).
 */
export function pageRange(current: number, total: number): PageRangeEntry[] {
  const shown = new Set<number>([1, total]);
  for (let page = current - 1; page <= current + 1; page++) {
    if (page >= 1 && page <= total) shown.add(page);
  }
  const sorted = [...shown].sort((a, b) => a - b);

  const result: PageRangeEntry[] = [];
  let previous = 0;
  for (const page of sorted) {
    if (page - previous === 2) result.push(previous + 1);
    else if (page - previous > 2) result.push("ellipsis");
    result.push(page);
    previous = page;
  }
  return result;
}

/** Href for `page`, keeping every other param; page 1 drops the param. */
export function pageHref(basePath: string, params: SearchParamsInput, page: number): string {
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (key === PAGE_PARAM) continue;
    for (const item of toArray(value)) usp.append(key, item);
  }
  if (page > 1) usp.set(PAGE_PARAM, String(page));
  const qs = usp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
