import Link from "next/link";
import type { CourseRecord } from "@/lib/courses/schema";
import { catalogNumber } from "@/lib/courses/catalog-number";
import { PlatformStamp } from "./PlatformStamp";
import { VerifiedBadge } from "./VerifiedBadge";

export function CourseCard({
  course,
  categorySlugs,
}: {
  course: CourseRecord;
  /** Slugs of every course in this category, for a stable catalog number. */
  categorySlugs: string[];
}) {
  const number = catalogNumber(course.category, course.slug, categorySlugs);

  return (
    <Link
      href={`/${course.category}/${course.slug}`}
      className="group flex flex-col gap-4 border border-rule bg-card p-5 transition-colors hover:border-ink"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-xs text-ink-muted">Ficha {number}</span>
        <PlatformStamp platform={course.platform} size="sm" />
      </div>
      <h3 className="font-serif text-lg leading-snug text-ink group-hover:underline group-hover:decoration-rule group-hover:underline-offset-4">
        {course.title}
      </h3>
      <div className="flex flex-col gap-0.5">
        {course.author && (
          <span className="font-mono text-[11px] text-ink-muted">{course.author}</span>
        )}
        <span className="font-mono text-[11px]">
          <VerifiedBadge date={course.lastVerifiedAt} />
        </span>
      </div>
    </Link>
  );
}
