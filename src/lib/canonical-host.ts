import { SITE_URL } from "./site";

// Hosts that still reach this app but must 301 to the canonical domain:
// the legacy subdomain (the site moved to cursosgratis.pro) and www.
const LEGACY_HOSTS = new Set(["cursos.unaividal.com", "www.cursosgratis.pro"]);

// Served as-is on every host: ads.txt is read per domain, and the IAB spec
// only follows redirects that stay within the original root domain.
const HOST_LOCAL_PATHS = new Set(["/ads.txt"]);

/**
 * Where a request should be permanently redirected, or null to serve it.
 * Keeps path and query so every old URL lands on its exact new page.
 */
export function canonicalRedirect(host: string | null, pathname: string, search: string): string | null {
  const hostname = host?.split(":")[0].toLowerCase() ?? "";
  if (!LEGACY_HOSTS.has(hostname) || HOST_LOCAL_PATHS.has(pathname)) return null;
  return `${SITE_URL}${pathname === "/" ? "" : pathname}${search}`;
}
