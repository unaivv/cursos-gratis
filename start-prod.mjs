import { readFileSync } from "fs";
import { resolve } from "path";

// Parse .env.local manually to handle multi-line values and quotes
const envPath = resolve("/home/unai/apps/cursos-unaividal/.env.local");
const content = readFileSync(envPath, "utf8");
const lines = content.split("\n");

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx < 0) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  let value = trimmed.slice(eqIdx + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  process.env[key] = value;
}

process.env.PORT = "3007";
process.env.HOSTNAME = "0.0.0.0";
process.env.NODE_ENV = "production";

console.log("[start] DATABASE_URL set:", !!process.env.DATABASE_URL);

await import("/home/unai/apps/cursos-unaividal/.next/standalone/server.js");
