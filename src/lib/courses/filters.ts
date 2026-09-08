import type { CourseRecord } from "./schema";

/** Empty `categories`/`platforms` means "no filter on that dimension". */
export function filterCourses(
  all: CourseRecord[],
  { categories, platforms }: { categories: string[]; platforms: string[] }
): CourseRecord[] {
  return all.filter((course) => {
    if (categories.length > 0 && !categories.includes(course.category)) return false;
    if (platforms.length > 0 && !platforms.includes(course.platform)) return false;
    return true;
  });
}
