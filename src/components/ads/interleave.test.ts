import { describe, expect, it } from "vitest";
import { interleaveAds } from "./interleave";

const shape = (entries: ReturnType<typeof interleaveAds<number>>) =>
  entries.map((entry) => (entry.type === "ad" ? `ad${entry.slot}` : entry.item));

describe("interleaveAds", () => {
  it("puts an ad after every `every` items", () => {
    expect(shape(interleaveAds([1, 2, 3, 4, 5], 2))).toEqual([1, 2, "ad0", 3, 4, "ad1", 5]);
  });

  it("never ends on an ad", () => {
    expect(shape(interleaveAds([1, 2, 3, 4], 2))).toEqual([1, 2, "ad0", 3, 4]);
  });

  it("adds no ad to a list no longer than `every`", () => {
    expect(shape(interleaveAds([1, 2, 3], 3))).toEqual([1, 2, 3]);
    expect(interleaveAds([], 3)).toEqual([]);
  });

  it("leaves the items untouched for a non-positive or fractional spacing", () => {
    expect(shape(interleaveAds([1, 2, 3], 0))).toEqual([1, 2, 3]);
    expect(shape(interleaveAds([1, 2, 3], -1))).toEqual([1, 2, 3]);
    expect(shape(interleaveAds([1, 2, 3], 1.5))).toEqual([1, 2, 3]);
  });
});
