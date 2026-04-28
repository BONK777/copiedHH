import { describe, expect, it } from "vitest";
import { signUpSchema } from "@/lib/validators/auth";
import { vacancySchema } from "@/lib/validators/vacancy";

describe("schemas", () => {
  it("validates sign up", () => {
    const parsed = signUpSchema.safeParse({
      name: "Ivan",
      email: "ivan@test.com",
      password: "password123",
      role: "CANDIDATE"
    });

    expect(parsed.success).toBe(true);
  });

  it("validates vacancy", () => {
    const parsed = vacancySchema.safeParse({
      title: "Frontend Engineer",
      description: "A".repeat(30),
      location: "Remote"
    });

    expect(parsed.success).toBe(true);
  });
});
