import { and, asc, eq, ilike, inArray, or } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { courses as coursesTable, categories as categoriesTable, type CourseRow } from "@/lib/db/schema";
import type { Category, CourseRecord } from "./schema";
import { parseAnalysis } from "./ai-analysis";

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
 *
 * Exception: the full published catalog (readAllCourses) is memoized
 * in-process for CATALOG_TTL_MS. Every public page and the sitemap/llms.txt
 * need it, and at ~2k courses with their analyses a fresh read per
 * request (several per course page) blew the server's memory under
 * crawler traffic. Admin changes therefore show up within that window.
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
    editorNote: row.editorNote ?? undefined,
    description: row.description ?? undefined,
    durationSeconds: row.durationSeconds ?? undefined,
    lessonCount: row.lessonCount ?? undefined,
    chapters: row.chapters?.length ? row.chapters : undefined,
    publishedAt: row.publishedAt ?? undefined,
    aiSummary: row.aiSummary ?? undefined,
    aiOverview: row.aiOverview ?? undefined,
    aiHighlights: row.aiHighlights?.length ? row.aiHighlights : undefined,
    aiLevel: row.aiLevel ?? undefined,
    aiAnalysis: parseAnalysis(row.aiAnalysis) ?? undefined,
    aiAnalyzedAt: row.aiAnalyzedAt?.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
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

const CATALOG_TTL_MS = 60_000;
let catalogCache: { at: number; promise: Promise<CourseRecord[]> } | null = null;

async function queryAllCourses(): Promise<CourseRecord[]> {
  const rows = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.status, "published"))
    .orderBy(asc(coursesTable.slug));
  return rows.map(toCourseRecord);
}

export function readAllCourses(): Promise<CourseRecord[]> {
  // Concurrent requests share the in-flight query; a failed query is not cached.
  if (!catalogCache || Date.now() - catalogCache.at > CATALOG_TTL_MS) {
    const promise = queryAllCourses();
    catalogCache = { at: Date.now(), promise };
    promise.catch(() => {
      if (catalogCache?.promise === promise) catalogCache = null;
    });
  }
  return catalogCache.promise;
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
