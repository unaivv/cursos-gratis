import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output for the raspi deploy — same pattern as the other
  // apps on that host (rsync .next/standalone + .next/static + public,
  // run server.js directly under PM2, no full node_modules needed there).
  output: "standalone",
};

export default nextConfig;
