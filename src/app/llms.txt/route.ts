import { readAllCourses, readCategories } from "@/lib/courses/read";
import { CATEGORY_EDITORIAL } from "@/lib/editorial/categories";
import { GUIDES } from "@/lib/editorial/guides";
import { buildLlmsTxt } from "@/lib/seo/llms-txt";

// Dynamic for the same reason as the sitemap — see src/lib/courses/read.ts.
// A static `llms.txt` segment wins over the `[category]` dynamic route.
export const dynamic = "force-dynamic";

export async function GET() {
  const [courses, categories] = await Promise.all([readAllCourses(), readCategories()]);
  const taglines = Object.fromEntries(Object.entries(CATEGORY_EDITORIAL).map(([slug, entry]) => [slug, entry.tagline]));
  const body = buildLlmsTxt({ categories, courses, guides: GUIDES, taglines });
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
