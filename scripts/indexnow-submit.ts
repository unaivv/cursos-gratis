/**
 * Pushes changed URLs to IndexNow (Bing & co.) from the live sitemap.
 *
 * Run: npx tsx scripts/indexnow-submit.ts [--days N | --all]
 *   --days N  URLs whose sitemap lastmod is within the last N days (default 8,
 *             so a weekly run after the YouTube sync covers its new courses)
 *   --all     every URL in the sitemap (one-off, e.g. after a domain move)
 */
import { SITE_URL } from "../src/lib/site";
import { INDEXNOW_ENDPOINT, INDEXNOW_MAX_URLS, indexNowPayload, parseSitemap, selectChangedUrls } from "../src/lib/seo/indexnow";

async function main() {
  const args = process.argv.slice(2);
  const all = args.includes("--all");
  const daysArg = args.indexOf("--days");
  const days = daysArg >= 0 ? Number(args[daysArg + 1]) : 8;
  const since = all ? null : new Date(Date.now() - days * 86_400_000);

  const res = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const urls = selectChangedUrls(parseSitemap(await res.text()), since);
  console.log(`${urls.length} URL(s) to submit${since ? ` (changed since ${since.toISOString().slice(0, 10)})` : ""}`);
  if (urls.length === 0) return;

  for (let i = 0; i < urls.length; i += INDEXNOW_MAX_URLS) {
    const chunk = urls.slice(i, i + INDEXNOW_MAX_URLS);
    const r = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(indexNowPayload(chunk)),
    });
    // 200 OK / 202 Accepted (key validation pending) are both success.
    console.log(`IndexNow: ${chunk.length} URL(s) → HTTP ${r.status}`);
    if (r.status !== 200 && r.status !== 202) {
      process.exitCode = 1;
      console.error(await r.text());
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
