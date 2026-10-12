import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { FILTER_QUERY_DISALLOW } from "@/lib/seo/crawl";

// Private areas — nothing there is public content.
const PRIVATE = ["/admin", "/api/", "/ad-frame/"];

const DISALLOW = [...PRIVATE, ...FILTER_QUERY_DISALLOW];

// AI search/answer crawlers, named explicitly so the intent is clear:
// citing this catalog in AI answers is welcome. A crawler that matches a
// named group ignores the `*` group, so each one repeats the disallows.
const AI_CRAWLERS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Google-Extended",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: DISALLOW },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
