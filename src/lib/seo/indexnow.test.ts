import { describe, expect, it } from "vitest";
import { indexNowPayload, INDEXNOW_KEY, parseSitemap, selectChangedUrls } from "./indexnow";

const xml = `<urlset>
<url><loc>https://cursosgratis.pro</loc><lastmod>2026-10-08T10:00:00.000Z</lastmod></url>
<url><loc>https://cursosgratis.pro/como-verificamos</loc></url>
<url><loc>https://cursosgratis.pro/programming/x</loc><lastmod>2026-09-01</lastmod></url>
<url><loc>https://other.example/y</loc><lastmod>2026-10-08</lastmod></url>
</urlset>`;

describe("indexnow", () => {
  it("parses loc and lastmod", () => {
    expect(parseSitemap(xml)).toHaveLength(4);
    expect(parseSitemap(xml)[1]).toEqual({ loc: "https://cursosgratis.pro/como-verificamos" });
  });

  it("selects this site's URLs changed since a date, or all of them", () => {
    const entries = parseSitemap(xml);
    expect(selectChangedUrls(entries, new Date("2026-10-01"))).toEqual(["https://cursosgratis.pro"]);
    expect(selectChangedUrls(entries, null)).toHaveLength(3);
  });

  it("builds the payload with the hosted key file", () => {
    expect(indexNowPayload(["https://cursosgratis.pro"])).toEqual({
      host: "cursosgratis.pro",
      key: INDEXNOW_KEY,
      keyLocation: `https://cursosgratis.pro/${INDEXNOW_KEY}.txt`,
      urlList: ["https://cursosgratis.pro"],
    });
  });
});
