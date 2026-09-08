import { describe, expect, it } from "vitest";
import { nextCourseStatus } from "./status-transition";

describe("nextCourseStatus", () => {
  it("published -> pending", () => {
    expect(nextCourseStatus("published")).toBe("pending");
  });

  it("pending -> published", () => {
    expect(nextCourseStatus("pending")).toBe("published");
  });
});
