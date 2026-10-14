import Link from "next/link";
import type { SearchParamsInput } from "@/lib/courses/query-params";
import { pageHref, pageRange } from "@/lib/courses/pagination";

const ITEM = "inline-flex min-w-9 items-center justify-center border px-3 py-1.5 font-mono text-sm";
const ITEM_LINK = `${ITEM} border-rule bg-card text-ink-muted hover:border-ink hover:text-ink`;
const ITEM_CURRENT = `${ITEM} border-ink bg-ink text-paper`;
const ITEM_DISABLED = `${ITEM} border-rule text-rule`;

/**
 * Prev/next + compact page numbers for a paginated listing. Plain links,
 * followable by crawlers so every page (and every course on it) stays
 * reachable — unless `nofollow` is set, for filtered views that are
 * already kept out of the crawl.
 */
export function Pagination({
  basePath,
  searchParams,
  current,
  total,
  nofollow = false,
}: {
  basePath: string;
  searchParams: SearchParamsInput;
  current: number;
  total: number;
  nofollow?: boolean;
}) {
  if (total <= 1) return null;
  const rel = nofollow ? "nofollow" : undefined;
  const href = (page: number) => pageHref(basePath, searchParams, page);

  return (
    <nav aria-label="Paginación" className="mt-10 flex flex-col items-center gap-3">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          {current > 1 ? (
            <Link href={href(current - 1)} rel={nofollow ? "nofollow prev" : "prev"} className={ITEM_LINK}>
              ← <span className="sr-only sm:not-sr-only sm:ml-1">anterior</span>
            </Link>
          ) : (
            <span aria-hidden="true" className={ITEM_DISABLED}>
              ←
            </span>
          )}
        </li>
        {pageRange(current, total).map((entry, index) =>
          entry === "ellipsis" ? (
            <li key={`ellipsis-${index}`} aria-hidden="true" className="px-1 font-mono text-sm text-ink-muted">
              …
            </li>
          ) : (
            <li key={entry}>
              {entry === current ? (
                <span aria-current="page" className={ITEM_CURRENT}>
                  <span className="sr-only">Página </span>
                  {entry}
                </span>
              ) : (
                <Link href={href(entry)} rel={rel} className={ITEM_LINK}>
                  <span className="sr-only">Página </span>
                  {entry}
                </Link>
              )}
            </li>
          )
        )}
        <li>
          {current < total ? (
            <Link href={href(current + 1)} rel={nofollow ? "nofollow next" : "next"} className={ITEM_LINK}>
              <span className="sr-only sm:not-sr-only sm:mr-1">siguiente</span> →
            </Link>
          ) : (
            <span aria-hidden="true" className={ITEM_DISABLED}>
              →
            </span>
          )}
        </li>
      </ul>
      <p className="font-mono text-xs text-ink-muted">
        página {current} de {total}
      </p>
    </nav>
  );
}
