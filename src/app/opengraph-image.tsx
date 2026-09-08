import { ImageResponse } from "next/og";

export const alt = "cursos.unaividal.com — cursos gratis, catalogados por materia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Site-wide share card: same "ticket" ink-stamp language as the app
// itself (paper ground, ink text, stamp-red border), not a generic
// gradient banner. Per-course pages override this with their own ticket
// in [category]/[slug]/opengraph-image.tsx.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#f7f5f0",
          color: "#1e1e1e",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            border: "3px solid #c84b31",
            borderStyle: "double",
            color: "#c84b31",
            fontFamily: "monospace",
            fontSize: 22,
            letterSpacing: 2,
            padding: "10px 22px",
            marginBottom: 44,
          }}
        >
          VERIFICADO GRATIS
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.15 }}>
          cursos<span style={{ color: "#c84b31" }}>.</span>
        </div>
        <div style={{ display: "flex", fontSize: 34, marginTop: 24, maxWidth: 820 }}>
          Cursos gratis, catalogados por materia — YouTube y Udemy, sin cuentas ni pagos.
        </div>
      </div>
    ),
    { ...size }
  );
}
