import { describe, expect, it } from "vitest";
import { isSignUpPath } from "./guards";

describe("isSignUpPath", () => {
  it("blocks /sign-up/email", () => {
    expect(isSignUpPath(["sign-up", "email"])).toBe(true);
  });

  it("blocks a bare /sign-up", () => {
    expect(isSignUpPath(["sign-up"])).toBe(true);
  });

  it("allows /sign-in/email", () => {
    expect(isSignUpPath(["sign-in", "email"])).toBe(false);
  });

  it("allows /session", () => {
    expect(isSignUpPath(["session"])).toBe(false);
  });

  it("does not false-positive on a path merely containing 'sign-up' later", () => {
    expect(isSignUpPath(["session", "sign-up"])).toBe(false);
  });
});
