import { describe, expect, it } from "vitest";
import { daysSinceVerified, freshnessTier } from "./freshness";

const TODAY = new Date("2026-09-08T12:00:00Z");

describe("daysSinceVerified", () => {
  it("is 0 for today", () => {
    expect(daysSinceVerified("2026-09-08", TODAY)).toBe(0);
  });

  it("counts whole days back", () => {
    expect(daysSinceVerified("2026-08-01", TODAY)).toBe(38);
  });
});

describe("freshnessTier", () => {
  it("is fresh within 7 days", () => {
    expect(freshnessTier("2026-09-08", TODAY)).toBe("fresh");
    expect(freshnessTier("2026-09-01", TODAY)).toBe("fresh");
  });

  it("is aging between 8 and 30 days", () => {
    expect(freshnessTier("2026-08-31", TODAY)).toBe("aging");
    expect(freshnessTier("2026-08-09", TODAY)).toBe("aging");
  });

  it("is stale past 30 days", () => {
    expect(freshnessTier("2026-08-08", TODAY)).toBe("stale");
    expect(freshnessTier("2020-01-01", TODAY)).toBe("stale");
  });
});
