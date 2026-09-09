import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { getParamValues, toggleParamHref, type SearchParamsInput } from "@/lib/courses/query-params";

const PILL_ACTIVE =
  "inline-flex items-center gap-2.5 border border-stamp-gold bg-stamp-gold px-3 py-1.5 text-sm font-medium text-paper";
const PILL_INACTIVE =
  "inline-flex items-center gap-2.5 border border-rule px-3 py-1.5 text-sm text-ink-muted hover:border-ink hover:text-ink";

/**
 * A row of toggle pills for one multi-select filter dimension (category,
 * platform, ...). Each pill is a plain link — filtering works with JS
 * disabled, matching the site's SEO-first rendering.
 */
export function FilterPills({
  basePath,
  searchParams,
  paramKey,
  options,
  label,
  allHref,
}: {
  basePath: string;
  searchParams: SearchParamsInput;
  paramKey: string;
  options: { value: string; label: string; icon?: LucideIcon }[];
  label: string;
  /** When set, renders a leading "Todas" pill linking here — active
   * whenever nothing in this dimension is selected. */
  allHref?: string;
}) {
  const selected = new Set(getParamValues(searchParams, paramKey));

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm text-ink-muted">{label}</legend>
      <ul className="flex flex-wrap gap-2">
        {allHref && (
          <li>
            <Link href={allHref} aria-pressed={selected.size === 0} className={selected.size === 0 ? PILL_ACTIVE : PILL_INACTIVE}>
              Todas
            </Link>
          </li>
        )}
        {options.map((opt) => {
          const isActive = selected.has(opt.value);
          const Icon = opt.icon;
          return (
            <li key={opt.value}>
              <Link
                href={toggleParamHref(basePath, searchParams, paramKey, opt.value)}
                aria-pressed={isActive}
                className={isActive ? PILL_ACTIVE : PILL_INACTIVE}
              >
                {Icon && <Icon size={14} strokeWidth={1.75} aria-hidden="true" />}
                {opt.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
