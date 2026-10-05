import { describe, expect, it } from "vitest";
import { canonicalRedirect } from "./canonical-host";

describe("canonicalRedirect", () => {
  it("moves legacy-subdomain URLs to the same path and query on the new domain", () => {
    expect(canonicalRedirect("cursos.unaividal.com", "/programming/curso-x", "?ref=a")).toBe(
      "https://cursosgratis.pro/programming/curso-x?ref=a"
    );
    expect(canonicalRedirect("cursos.unaividal.com", "/", "")).toBe("https://cursosgratis.pro");
  });

  it("drops www", () => {
    expect(canonicalRedirect("www.cursosgratis.pro", "/guias", "")).toBe("https://cursosgratis.pro/guias");
  });

  it("serves the canonical host, unknown hosts and ads.txt as-is", () => {
    expect(canonicalRedirect("cursosgratis.pro", "/guias", "")).toBeNull();
    expect(canonicalRedirect("localhost:3000", "/", "")).toBeNull();
    expect(canonicalRedirect(null, "/", "")).toBeNull();
    expect(canonicalRedirect("cursos.unaividal.com", "/ads.txt", "")).toBeNull();
  });
});
