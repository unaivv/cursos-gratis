/**
 * Filter combinations (`?category=…&platform=…`) from the filter pills:
 * every pairing is a separate URL canonicalized back to the plain page, so
 * crawling them only burns crawl budget (Search Console: ~1.3k "alternate
 * page with proper canonical"). Anchored on `?`/`&` so the param name must
 * match exactly — UTM-tagged URLs (even `utm_source_platform=`), plain
 * category pages, course pages and `/buscar?q=` stay crawlable.
 */
export const FILTER_QUERY_DISALLOW = ["/*?category=", "/*&category=", "/*?platform=", "/*&platform="];
