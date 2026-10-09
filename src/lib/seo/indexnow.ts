import { SITE_URL } from "@/lib/site";

/**
 * IndexNow (Bing, Yandex, Seznam…; ChatGPT search reads Bing's index):
 * notifies search engines of new/changed URLs instead of waiting for a
 * crawl. The key is public by design — it is served at
 * `${SITE_URL}/${INDEXNOW_KEY}.txt` (app route) to prove site ownership.
 */
export const INDEXNOW_KEY = "5b1d87183b041cde269a4693e29fdf41";
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
// Protocol limit per request.
export const INDEXNOW_MAX_URLS = 10_000;

export type SitemapEntry = { loc: string; lastmod?: string };

export function parseSitemap(xml: string): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const [, block] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = /<loc>([^<]+)<\/loc>/.exec(block)?.[1]?.trim();
    if (!loc) continue;
    const lastmod = /<lastmod>([^<]+)<\/lastmod>/.exec(block)?.[1]?.trim();
    entries.push(lastmod ? { loc, lastmod } : { loc });
  }
  return entries;
}

/** URLs on this site changed at/after `since` (all of them when null). */
export function selectChangedUrls(entries: SitemapEntry[], since: Date | null): string[] {
  const host = new URL(SITE_URL).host;
  return entries
    .filter((e) => new URL(e.loc).host === host)
    .filter((e) => !since || (e.lastmod !== undefined && new Date(e.lastmod) >= since))
    .map((e) => e.loc);
}

export function indexNowPayload(urlList: string[]) {
  const host = new URL(SITE_URL).host;
  return { host, key: INDEXNOW_KEY, keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`, urlList };
}
