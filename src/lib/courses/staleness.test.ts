import { describe, expect, it } from "vitest";
import { isStaleUdemy } from "./staleness";

const now = new Date("2026-09-08");

describe("isStaleUdemy", () => {
  it("is never stale for YouTube (auto-refreshed by sync)", () => {
    expect(isStaleUdemy({ platform: "youtube", lastVerifiedAt: "2020-01-01" }, now)).toBe(false);
  });

  it("is not stale within the reverify window (30 days)", () => {
    expect(isStaleUdemy({ platform: "udemy", lastVerifiedAt: "2026-08-20" }, now)).toBe(false);
  });

  it("is stale past the reverify window", () => {
    expect(isStaleUdemy({ platform: "udemy", lastVerifiedAt: "2026-06-01" }, now)).toBe(true);
  });
});
