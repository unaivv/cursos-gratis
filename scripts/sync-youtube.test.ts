import { describe, expect, it } from "vitest";
import {
  buildCourseSlug,
  dedupeByVideoId,
  mapVideoToCourseRecord,
  type CuratedSource,
} from "./sync-youtube";

const source: CuratedSource = {
  channelId: "UCxxxx",
  channelName: "Example Channel",
  category: "programming",
};

describe("buildCourseSlug", () => {
  it("produces a kebab-case slug ending in the video id", () => {
    expect(buildCourseSlug("Learn Python - Full Course!", "abc123")).toBe(
      "learn-python-full-course-abc123"
    );
  });

  it("sanitizes underscores in the video id (real YouTube IDs can contain them)", () => {
    // Regression: an unsanitized `_` in the id broke courseRecordSchema's
    // kebab-case slug validation in production (ZodError, sync crashed).
    expect(buildCourseSlug("Some Title", "abc_DEF-123")).toBe("some-title-abc-def-123");
  });
});

describe("mapVideoToCourseRecord", () => {
  it("maps a video to a valid, always-free course record", () => {
    const record = mapVideoToCourseRecord(
      { videoId: "abc123", title: "Learn Python" },
      source,
      "2026-01-01"
    );
    expect(record).toMatchObject({
      platform: "youtube",
      freeStatus: "free",
      category: "programming",
      sourceUrl: "https://www.youtube.com/watch?v=abc123",
      youtube: { videoId: "abc123", channelId: "UCxxxx" },
    });
  });
});

describe("dedupeByVideoId", () => {
  it("does not duplicate a video already stored (spec: idempotent sync)", () => {
    const existing = [
      mapVideoToCourseRecord({ videoId: "abc123", title: "Old Title" }, source, "2026-01-01"),
    ];
    const incoming = [
      mapVideoToCourseRecord({ videoId: "abc123", title: "Old Title" }, source, "2026-02-01"),
    ];

    const merged = dedupeByVideoId(existing, incoming);

    expect(merged).toHaveLength(1);
    expect(merged[0].lastVerifiedAt).toBe("2026-02-01");
  });

  it("keeps distinct videos as separate records", () => {
    const existing = [
      mapVideoToCourseRecord({ videoId: "abc123", title: "A" }, source, "2026-01-01"),
    ];
    const incoming = [
      mapVideoToCourseRecord({ videoId: "def456", title: "B" }, source, "2026-01-01"),
    ];

    const merged = dedupeByVideoId(existing, incoming);

    expect(merged).toHaveLength(2);
  });

  it("preserves a published record's status across a re-sync", () => {
    const existing = [
      { ...mapVideoToCourseRecord({ videoId: "abc123", title: "Old Title" }, source, "2026-01-01"), status: "published" as const },
    ];
    const incoming = [
      mapVideoToCourseRecord({ videoId: "abc123", title: "Refreshed Title" }, source, "2026-02-01"),
    ];

    const merged = dedupeByVideoId(existing, incoming);

    expect(merged).toHaveLength(1);
    expect(merged[0].status).toBe("published");
    expect(merged[0].title).toBe("Refreshed Title");
  });
});
