import { describe, expect, it } from "vitest";
import { courseRecordSchema } from "./schema";

function omit<T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  const copy = { ...obj };
  delete copy[key];
  return copy;
}

const validYoutube = {
  slug: "example-course",
  title: "Example Course",
  platform: "youtube" as const,
  category: "programming",
  sourceUrl: "https://www.youtube.com/watch?v=abc123",
  freeStatus: "free" as const,
  lastVerifiedAt: "2026-01-01",
  youtube: { videoId: "abc123", channelId: "UCxxxx" },
};

describe("courseRecordSchema", () => {
  it("accepts a fully-populated free YouTube course", () => {
    const result = courseRecordSchema.safeParse(validYoutube);
    expect(result.success).toBe(true);
  });

  it("accepts a free Udemy course without a youtube field", () => {
    const result = courseRecordSchema.safeParse({
      ...omit(validYoutube, "youtube"),
      platform: "udemy",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a record missing the title", () => {
    const result = courseRecordSchema.safeParse(omit(validYoutube, "title"));
    expect(result.success).toBe(false);
  });

  it("rejects a record missing the source URL", () => {
    const result = courseRecordSchema.safeParse(omit(validYoutube, "sourceUrl"));
    expect(result.success).toBe(false);
  });

  it("rejects a record missing lastVerifiedAt", () => {
    const result = courseRecordSchema.safeParse(omit(validYoutube, "lastVerifiedAt"));
    expect(result.success).toBe(false);
  });

  it("rejects a youtube-platform record without youtube provenance", () => {
    const result = courseRecordSchema.safeParse(omit(validYoutube, "youtube"));
    expect(result.success).toBe(false);
  });

  it("rejects a paid course (freeStatus must be literal 'free')", () => {
    const result = courseRecordSchema.safeParse({ ...validYoutube, freeStatus: "paid" });
    expect(result.success).toBe(false);
  });

  it("defaults status to 'pending' when omitted", () => {
    // validYoutube has no `status` key at all — the schema must default it.
    const result = courseRecordSchema.safeParse(validYoutube);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.status).toBe("pending");
  });

  it("accepts an explicit 'published' status", () => {
    const result = courseRecordSchema.safeParse({ ...validYoutube, status: "published" });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid status value", () => {
    const result = courseRecordSchema.safeParse({ ...validYoutube, status: "archived" });
    expect(result.success).toBe(false);
  });
});
