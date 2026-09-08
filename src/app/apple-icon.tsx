import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Same mark as icon.tsx, scaled up for iOS home-screen quality (no
// rounded-corner masking needed — the OS applies its own).
export default function AppleIcon() {
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
        }}
      >
        <span
          style={{
            fontFamily: "serif",
            fontWeight: 700,
            fontSize: 120,
            color: "#1e1e1e",
            lineHeight: 1,
          }}
        >
          c<span style={{ color: "#c84b31" }}>.</span>
        </span>
      </div>
    ),
    { ...size }
  );
}
