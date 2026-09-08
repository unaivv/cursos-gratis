import type { MetadataRoute } from "next";
import { readAllCourses, readCategories } from "@/lib/courses/read";
import { SITE_URL } from "@/lib/site";

// Dynamic for the same reason every public page is — see
// src/lib/courses/read.ts. A new/published course must appear without a
// rebuild, sitemap included.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courses, categories] = await Promise.all([readAllCourses(), readCategories()]);

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/${category.slug}`,
    changeFrequency: "weekly",
  }));

  const courseEntries: MetadataRoute.Sitemap = courses.map((course) => ({
    url: `${SITE_URL}/${course.category}/${course.slug}`,
    lastModified: course.lastVerifiedAt,
    changeFrequency: "monthly",
  }));

  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/como-verificamos`, changeFrequency: "yearly" },
    { url: `${SITE_URL}/buscar`, changeFrequency: "monthly" },
    ...categoryEntries,
    ...courseEntries,
  ];
}
