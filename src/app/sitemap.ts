import type { MetadataRoute } from "next";
import { readAllCourses, readCategories } from "@/lib/courses/read";
import { isIndexableCourse } from "@/lib/courses/depth";
import { courseDateModified } from "@/lib/courses/quick-answer";
import { GUIDES } from "@/lib/editorial/guides";
import { SITE_URL } from "@/lib/site";

// Dynamic for the same reason every public page is — see
// src/lib/courses/read.ts. A new/published course must appear without a
// rebuild, sitemap included.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courses, categories] = await Promise.all([readAllCourses(), readCategories()]);

  // A listing page changes when any of its courses does: latest course
  // change per category, and across the catalog for the home page.
  const latestByCategory = new Map<string, string>();
  for (const course of courses) {
    const modified = courseDateModified(course);
    const current = latestByCategory.get(course.category);
    if (!current || Date.parse(modified) > Date.parse(current)) latestByCategory.set(course.category, modified);
  }
  const latest = (dates: (string | undefined)[]) =>
    dates.filter((d): d is string => Boolean(d)).sort((a, b) => Date.parse(b) - Date.parse(a))[0];
  const catalogModified = latest([...latestByCategory.values()]);
  const guidesModified = latest(GUIDES.map((guide) => guide.updated));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/${category.slug}`,
    lastModified: latestByCategory.get(category.slug),
    changeFrequency: "weekly",
  }));

  const guideEntries: MetadataRoute.Sitemap = GUIDES.map((guide) => ({
    url: `${SITE_URL}/guias/${guide.slug}`,
    lastModified: guide.updated,
    changeFrequency: "monthly",
    priority: guide.kind === "ruta" ? 0.8 : 0.7,
  }));

  // Only pages with original editorial content are indexable (see
  // lib/courses/depth.ts) — the rest are noindex, so they stay out of
  // the sitemap too. A course joins it on its own once analyzed.
  const courseEntries: MetadataRoute.Sitemap = courses.filter(isIndexableCourse).map((course) => ({
    url: `${SITE_URL}/${course.category}/${course.slug}`,
    lastModified: courseDateModified(course),
    changeFrequency: "monthly",
  }));

  return [
    { url: SITE_URL, lastModified: catalogModified, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/como-verificamos`, changeFrequency: "yearly" },
    // /buscar is left out: it's a noindex results page (see buscar/page.tsx).
    { url: `${SITE_URL}/guias`, lastModified: guidesModified, changeFrequency: "monthly" },
    { url: `${SITE_URL}/sobre-el-proyecto`, changeFrequency: "yearly" },
    { url: `${SITE_URL}/contacto`, changeFrequency: "yearly" },
    ...categoryEntries,
    ...guideEntries,
    ...courseEntries,
  ];
}
