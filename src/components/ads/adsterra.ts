/**
 * Adsterra ad units — every key, size and script host in one place.
 * Codes copied from the Adsterra dashboard (publisher account approved).
 * Adsterra does not read the TCF signal itself, so the components gate
 * these units on the CMP consent snapshot, like GTM (see ConsentGate).
 */

// Kill switch: NEXT_PUBLIC_ADSTERRA_DISABLED=1 turns every unit off. Read at
// build time (NEXT_PUBLIC_*), so it needs a rebuild but no code change.
export const ADSTERRA_DISABLED = process.env.NEXT_PUBLIC_ADSTERRA_DISABLED === "1";

const BANNER_HOST = "https://www.highrevenueformat.com";
const NATIVE_HOST = "https://pl31607287.profitableratecpmnetwork.com";

export interface AdsterraBannerUnit {
  key: string;
  width: number;
  height: number;
}

export const ADSTERRA_BANNERS = {
  rectangle: { key: "5df471103f0965219b5444434fa2a15d", width: 300, height: 250 },
  leaderboard: { key: "5d395a26f279be9b5ba9c790d2d51a67", width: 728, height: 90 },
  mobileLeaderboard: { key: "522cb91eb7e807d8df10a8c996f2b6be", width: 320, height: 50 },
} satisfies Record<string, AdsterraBannerUnit>;

// 728 + card padding/border + the pages' px-6 gutter ≈ 802px; below that
// the 728x90 would overflow, so the 320x50 takes the slot instead.
export const LEADERBOARD_MEDIA_QUERY = "(min-width: 810px)";

const NATIVE_KEY = "e4b9c5beccd8d531ef19503ad5ff9afd";
export const ADSTERRA_NATIVE = {
  // invoke.js fills the element with exactly this id.
  containerId: `container-${NATIVE_KEY}`,
  scriptSrc: `${NATIVE_HOST}/${NATIVE_KEY}/invoke.js`,
};

/**
 * Standalone HTML document for one iframe banner. Adsterra's snippet reads
 * a global `atOptions`, so two banners in the same window would clash —
 * each one gets its own document (iframe `srcDoc`) instead. `<base
 * target="_blank">` keeps click-throughs in a new tab.
 */
export function bannerSrcDoc(unit: AdsterraBannerUnit): string {
  const options = JSON.stringify({
    key: unit.key,
    format: "iframe",
    height: unit.height,
    width: unit.width,
    params: {},
  });
  return [
    "<!doctype html><html><head><meta charset=\"utf-8\"><base target=\"_blank\">",
    "<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style>",
    "</head><body>",
    `<script>atOptions = ${options};</script>`,
    `<script src="${BANNER_HOST}/${unit.key}/invoke.js"></script>`,
    "</body></html>",
  ].join("");
}
