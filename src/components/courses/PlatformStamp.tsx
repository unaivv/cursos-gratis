import type { CourseRecord } from "@/lib/courses/schema";

const PLATFORM_LABEL: Record<CourseRecord["platform"], string> = {
  youtube: "YouTube",
  udemy: "Udemy",
};

// Each platform's own brand ink, muted to fit the paper/rule palette
// rather than the raw saturated brand hex — the stamp still reads as
// "this catalog's ink", just tinted per source.
const PLATFORM_COLOR: Record<CourseRecord["platform"], string> = {
  youtube: "border-platform-youtube text-platform-youtube",
  udemy: "border-platform-udemy text-platform-udemy",
};

/**
 * A rubber-stamp mark for platform + free status — stands in for a
 * colored "badge" pill, but as a real ink-stamp artifact (border, tilt,
 * platform-colored ink) rather than a generic SaaS chip.
 */
export function PlatformStamp({
  platform,
  size = "sm",
}: {
  platform: CourseRecord["platform"];
  size?: "sm" | "lg";
}) {
  const rotation = platform === "youtube" ? "-rotate-3" : "rotate-2";
  return (
    <span
      className={`inline-flex flex-col items-center border-2 px-2 py-1 font-mono ${PLATFORM_COLOR[platform]} ${rotation} ${
        size === "lg" ? "text-sm leading-tight" : "text-[10px] leading-tight"
      }`}
      style={{ borderStyle: "double", borderWidth: size === "lg" ? "4px" : "3px" }}
    >
      <span>{PLATFORM_LABEL[platform]}</span>
      <span>GRATIS</span>
    </span>
  );
}
