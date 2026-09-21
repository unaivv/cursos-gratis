import { describe, expect, it } from "vitest";
import { toCourseRecord } from "./read";
import type { CourseRow } from "@/lib/db/schema";

// DB-querying functions (readAllCourses, etc.) are verified against the
// real Supabase DB via the manual runtime harness, not unit tests — see
// openspec/changes/admin-panel/design.md, Testing Strategy. This file
// covers the one pure piece: mapping a DB row to the public CourseRecord
// shape.

const baseRow: CourseRow = {
  id: "11111111-1111-1111-1111-111111111111",
  slug: "example-course",
  title: "Example Course",
  author: "Jane Doe",
  platform: "youtube",
  category: "programming",
  sourceUrl: "https://www.youtube.com/watch?v=abc123",
  freeStatus: "free",
  status: "published",
  lastVerifiedAt: "2026-01-01",
  youtubeVideoId: "abc123",
  youtubePlaylistId: null,
  youtubeChannelId: "UCxxxx",
  editorNote: null,
  description: null,
  durationSeconds: null,
  lessonCount: null,
  chapters: null,
  publishedAt: null,
  enrichedAt: null,
  aiSummary: null,
  aiOverview: null,
  aiHighlights: null,
  aiLevel: null,
  aiGeneratedAt: null,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};

describe("toCourseRecord", () => {
  it("maps a YouTube row to a record with nested youtube provenance", () => {
    const record = toCourseRecord(baseRow);
    expect(record.youtube).toEqual({ videoId: "abc123", channelId: "UCxxxx" });
    expect(record.slug).toBe("example-course");
    expect(record.status).toBe("published");
    expect(record.author).toBe("Jane Doe");
  });

  it("maps enrichment columns, dropping nulls and empty chapter lists", () => {
    const bare = toCourseRecord({ ...baseRow, chapters: [] });
    expect(bare.chapters).toBeUndefined();
    expect(bare.durationSeconds).toBeUndefined();

    const enriched = toCourseRecord({
      ...baseRow,
      editorNote: "Muy buen ritmo.",
      durationSeconds: 3600,
      lessonCount: 12,
      chapters: [{ title: "Intro", start: 0 }],
      publishedAt: "2025-05-01",
    });
    expect(enriched.editorNote).toBe("Muy buen ritmo.");
    expect(enriched.durationSeconds).toBe(3600);
    expect(enriched.lessonCount).toBe(12);
    expect(enriched.chapters).toEqual([{ title: "Intro", start: 0 }]);
    expect(enriched.publishedAt).toBe("2025-05-01");
  });

  it("maps AI content columns, dropping nulls and empty highlight lists", () => {
    const bare = toCourseRecord({ ...baseRow, aiHighlights: [] });
    expect(bare.aiSummary).toBeUndefined();
    expect(bare.aiHighlights).toBeUndefined();
    expect(bare.aiLevel).toBeUndefined();

    const withAi = toCourseRecord({
      ...baseRow,
      aiSummary: "Resumen corto.",
      aiOverview: "Resumen largo.",
      aiHighlights: ["Variables", "Funciones"],
      aiLevel: "principiante",
    });
    expect(withAi.aiSummary).toBe("Resumen corto.");
    expect(withAi.aiOverview).toBe("Resumen largo.");
    expect(withAi.aiHighlights).toEqual(["Variables", "Funciones"]);
    expect(withAi.aiLevel).toBe("principiante");
  });

  it("maps a null author to undefined", () => {
    const record = toCourseRecord({ ...baseRow, author: null });
    expect(record.author).toBeUndefined();
  });

  it("maps a playlist-shaped row (no single video) with playlistId provenance", () => {
    const record = toCourseRecord({
      ...baseRow,
      youtubeVideoId: null,
      youtubePlaylistId: "PLxxxx",
    });
    expect(record.youtube).toEqual({ playlistId: "PLxxxx", channelId: "UCxxxx" });
  });

  it("maps a Udemy row (no youtube columns) with youtube left undefined", () => {
    const record = toCourseRecord({
      ...baseRow,
      platform: "udemy",
      youtubeVideoId: null,
      youtubeChannelId: null,
    });
    expect(record.youtube).toBeUndefined();
    expect(record.platform).toBe("udemy");
  });
});
