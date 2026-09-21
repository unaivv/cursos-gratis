import type { MetadataRoute } from "next";
import { readAllCourses, readCategories } from "@/lib/courses/read";
import { isThinCourse } from "@/lib/courses/depth";
import { GUIDES } from "@/lib/editorial/guides";
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

  const guideEntries: MetadataRoute.Sitemap = GUIDES.map((guide) => ({
    url: `${SITE_URL}/guias/${guide.slug}`,
    lastModified: guide.updated,
    changeFrequency: "monthly",
  }));

  // Thin pages are noindex (see the course page) — keep them out of the sitemap too.
  const courseEntries: MetadataRoute.Sitemap = courses.filter((course) => !isThinCourse(course)).map((course) => ({
    url: `${SITE_URL}/${course.category}/${course.slug}`,
    lastModified: course.lastVerifiedAt,
    changeFrequency: "monthly",
  }));

  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/como-verificamos`, changeFrequency: "yearly" },
    { url: `${SITE_URL}/buscar`, changeFrequency: "monthly" },
    { url: `${SITE_URL}/guias`, changeFrequency: "monthly" },
    { url: `${SITE_URL}/sobre-el-proyecto`, changeFrequency: "yearly" },
    { url: `${SITE_URL}/contacto`, changeFrequency: "yearly" },
    ...categoryEntries,
    ...guideEntries,
    ...courseEntries,
  ];
}
