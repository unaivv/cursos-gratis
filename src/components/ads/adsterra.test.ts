import { describe, expect, it } from "vitest";
import { ADSTERRA_BANNERS, bannerDocument } from "./adsterra";

describe("bannerDocument", () => {
  it("sets this unit's atOptions before loading its invoke.js", () => {
    const html = bannerDocument(ADSTERRA_BANNERS.rectangle);
    const options = html.indexOf(
      'atOptions = {"key":"5df471103f0965219b5444434fa2a15d","format":"iframe","height":250,"width":300,"params":{}};'
    );
    const script = html.indexOf(
      '<script src="https://www.highrevenueformat.com/5df471103f0965219b5444434fa2a15d/invoke.js"></script>'
    );
    expect(options).toBeGreaterThan(-1);
    expect(script).toBeGreaterThan(options);
  });

  it("opens click-throughs in a new tab", () => {
    expect(bannerDocument(ADSTERRA_BANNERS.leaderboard)).toContain('<base target="_blank">');
  });
});
