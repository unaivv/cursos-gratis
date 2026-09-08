import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// The wordmark's own accent — the italic "c." with a stamp-red dot — at
// favicon size, on the paper ground. Same identity as the header logo,
// not a separate mark invented for the tab.
export default function Icon() {
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
          border: "2px solid #c84b31",
        }}
      >
        <span
          style={{
            fontFamily: "serif",
            fontWeight: 700,
            fontSize: 22,
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
