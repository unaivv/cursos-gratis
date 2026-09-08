/**
 * Pure helpers for multi-select filter links (category/platform pills) —
 * every filter is a plain `<Link>` to a new URL, no client JS needed to
 * toggle a filter. Matches course-catalog-mvp's SEO-first requirement
 * (no client-side data fetching for primary content).
 */
export type SearchParamsInput = Record<string, string | string[] | undefined>;

export function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function getParamValues(params: SearchParamsInput, key: string): string[] {
  return toArray(params[key]);
}

/**
 * Href for toggling `value` in/out of the multi-select param `key`,
 * preserving every other param on `basePath`.
 */
export function toggleParamHref(
  basePath: string,
  params: SearchParamsInput,
  key: string,
  value: string
): string {
  const current = new Set(getParamValues(params, key));
  if (current.has(value)) {
    current.delete(value);
  } else {
    current.add(value);
  }

  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (k === key) continue;
    for (const item of toArray(v)) usp.append(k, item);
  }
  for (const item of current) usp.append(key, item);

  const qs = usp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** Href with every value cleared for the given keys (a "quitar filtros" link). */
export function clearParamsHref(basePath: string, params: SearchParamsInput, keys: string[]): string {
  const drop = new Set(keys);
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (drop.has(k)) continue;
    for (const item of toArray(v)) usp.append(k, item);
  }
  const qs = usp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
