import { ImageResponse } from "next/og";
import { getCourseBySlug, getCoursesByCategory } from "@/lib/courses/read";
import { catalogNumber } from "@/lib/courses/catalog-number";

export const alt = "Ficha de curso gratis";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PLATFORM_LABEL: Record<string, string> = { youtube: "YouTube", udemy: "Udemy" };

// Per-course share card — the same ticket look as the hero card on the
// home page (catalog number, platform stamp, title, verified date), so a
// link shared on WhatsApp/Twitter carries the site's actual identity
// instead of a generic fallback banner.
export default async function Image({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const [course, categoryCourses] = await Promise.all([
    getCourseBySlug(category, slug),
    getCoursesByCategory(category),
  ]);

  const number = course ? catalogNumber(category, slug, categoryCourses.map((c) => c.slug)) : "000.000";
  const title = course?.title ?? "Curso gratis";
  const platformLabel = course ? PLATFORM_LABEL[course.platform] : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f5f0",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            width: 920,
            padding: "56px 64px",
            background: "#fcfaf7",
            border: "1px solid #d8d4cc",
            color: "#1e1e1e",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", fontFamily: "monospace", fontSize: 26, color: "#444748" }}>
              {number}
            </div>
            {course && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  border: "3px solid #c84b31",
                  borderStyle: "double",
                  color: "#c84b31",
                  fontFamily: "monospace",
                  fontSize: 20,
                  padding: "8px 18px",
                }}
              >
                <span>{platformLabel}</span>
                <span>GRATIS</span>
              </div>
            )}
          </div>
          <div style={{ display: "flex", fontSize: 52, fontStyle: "italic", lineHeight: 1.2 }}>{title}</div>
          {course && (
            <div style={{ display: "flex", fontFamily: "monospace", fontSize: 22, color: "#444748" }}>
              verificado {course.lastVerifiedAt}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
