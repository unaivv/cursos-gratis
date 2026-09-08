import { and, asc, eq, ilike, inArray, or } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { courses as coursesTable, categories as categoriesTable, type CourseRow } from "@/lib/db/schema";
import type { Category, CourseRecord } from "./schema";

/**
 * Public reads — courses table, `published` only.
 * Spec: openspec/changes/admin-panel/specs/course-catalog/spec.md —
 * "Published-only public listing".
 *
 * Deliberately UNCACHED plain queries — see design.md, Decision:
 * Revalidation (revised). An earlier version used `unstable_cache` +
 * `revalidateTag`, but live testing showed `revalidateTag(tag, 'max')`
 * uses stale-while-revalidate (the admin's own change wasn't visible on
 * the very next request), and it's unconfirmed whether Next.js 16's
 * tag-invalidation even targets `unstable_cache` entries at all (the
 * docs only document `fetch`'s `next.tags` and `cacheTag()` as sources).
 * For this project's traffic (a personal site), a live Postgres query
 * per request is simple, always correct, and fast enough — not worth the
 * cache-invalidation fragility. The public pages are also no longer
 * pre-rendered via `generateStaticParams` for the same reason (a new/
 * newly-published course must show up without a rebuild).
 */

export function toCourseRecord(row: CourseRow): CourseRecord {
  return {
    slug: row.slug,
    title: row.title,
    author: row.author ?? undefined,
    platform: row.platform,
    category: row.category,
    sourceUrl: row.sourceUrl,
    freeStatus: row.freeStatus,
    status: row.status,
    lastVerifiedAt: row.lastVerifiedAt,
    youtube:
      (row.youtubeVideoId || row.youtubePlaylistId) && row.youtubeChannelId
        ? {
            videoId: row.youtubeVideoId ?? undefined,
            playlistId: row.youtubePlaylistId ?? undefined,
            channelId: row.youtubeChannelId,
          }
        : undefined,
  };
}

export async function readAllCourses(): Promise<CourseRecord[]> {
  const rows = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.status, "published"))
    .orderBy(asc(coursesTable.slug));
  return rows.map(toCourseRecord);
}

export async function readCategories(): Promise<Category[]> {
  return db.select().from(categoriesTable).orderBy(asc(categoriesTable.slug));
}

export async function getCoursesByCategory(categorySlug: string): Promise<CourseRecord[]> {
  const all = await readAllCourses();
  return all.filter((course) => course.category === categorySlug);
}

/**
 * Text search across title, author, and category (matched by its
 * human-readable Spanish name, not the slug — a search for "diseño"
 * should find the "design" category), case-insensitive substring match,
 * published courses only. Small catalog — a plain `ilike` query is
 * enough; revisit with full-text search if this ever grows into the
 * thousands of rows.
 */
export async function searchCourses(query: string): Promise<CourseRecord[]> {
  const q = query.trim();
  if (!q) return [];
  const pattern = `%${q}%`;

  const matchingCategories = await db
    .select({ slug: categoriesTable.slug })
    .from(categoriesTable)
    .where(ilike(categoriesTable.name, pattern));
  const matchingCategorySlugs = matchingCategories.map((c) => c.slug);

  const rows = await db
    .select()
    .from(coursesTable)
    .where(
      and(
        eq(coursesTable.status, "published"),
        or(
          ilike(coursesTable.title, pattern),
          ilike(coursesTable.author, pattern),
          matchingCategorySlugs.length > 0
            ? inArray(coursesTable.category, matchingCategorySlugs)
            : undefined
        )
      )
    )
    .orderBy(asc(coursesTable.slug));

  return rows.map(toCourseRecord);
}

export async function getCourseBySlug(
  categorySlug: string,
  slug: string
): Promise<CourseRecord | undefined> {
  const inCategory = await getCoursesByCategory(categorySlug);
  return inCategory.find((course) => course.slug === slug);
}
