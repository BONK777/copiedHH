import { describe, expect, it } from "vitest";
import { isAppRole } from "@/lib/types";

describe("isAppRole", () => {
  it("accepts valid roles", () => {
    expect(isAppRole("CANDIDATE")).toBe(true);
    expect(isAppRole("EMPLOYER")).toBe(true);
  });

  it("rejects invalid roles", () => {
    expect(isAppRole("ADMIN")).toBe(false);
    expect(isAppRole(undefined)).toBe(false);
  });
});
