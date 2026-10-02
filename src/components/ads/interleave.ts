export type Interleaved<T> = { type: "item"; item: T } | { type: "ad"; slot: number };

/**
 * Splices an ad marker after every `every` items, for in-feed units in a
 * list or grid. Never ends on an ad (one only goes in when more items
 * follow), and `slot` counts the ads from 0 so callers get stable keys.
 * A non-positive or non-integer `every` returns the items untouched.
 */
export function interleaveAds<T>(items: readonly T[], every: number): Interleaved<T>[] {
  const result: Interleaved<T>[] = [];
  const spaced = Number.isInteger(every) && every > 0;
  let slot = 0;
  items.forEach((item, index) => {
    if (spaced && index > 0 && index % every === 0) result.push({ type: "ad", slot: slot++ });
    result.push({ type: "item", item });
  });
  return result;
}
