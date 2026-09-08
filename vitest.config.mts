import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Mirrors tsconfig.json's "@/*" -> "./src/*" path alias — Vitest
    // doesn't read tsconfig paths on its own.
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "scripts/**/*.test.ts"],
    // src/lib/db/client.ts requires DATABASE_URL to construct the
    // postgres-js client, but that construction is lazy (no connection
    // until a query runs) — unit tests never query the real DB (see
    // design.md Testing Strategy), so a syntactically-valid placeholder
    // satisfies the constructor without needing real credentials in CI.
    env: {
      DATABASE_URL: "postgres://test:test@localhost:5432/test",
    },
  },
});
