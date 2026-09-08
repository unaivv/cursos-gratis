"use client";

import { trackOutboundClick } from "@/components/analytics/gtag";
import type { CourseRecord } from "@/lib/courses/schema";

const PLATFORM_LABEL: Record<CourseRecord["platform"], string> = {
  youtube: "YouTube",
  udemy: "Udemy",
};

/**
 * Outbound CTA styled like a library checkout stub — the dashed edge
 * reads as "tear here", matching the catalog-card system instead of a
 * generic pill button. Spec: course-catalog — Outbound click to source
 * platform (click MUST be tracked).
 */
export function OutboundCourseLink({ course }: { course: CourseRecord }) {
  return (
    <a
      href={course.sourceUrl}
      target="_blank"
      rel="nofollow noopener noreferrer"
      onClick={() =>
        trackOutboundClick({ courseSlug: course.slug, platform: course.platform })
      }
      className="group inline-flex w-fit items-center border-2 border-dashed border-stamp-red bg-paper px-6 py-3 font-sans font-medium text-stamp-red transition-colors hover:bg-stamp-red hover:text-paper"
    >
      Empezar en {PLATFORM_LABEL[course.platform]}
    </a>
  );
}
