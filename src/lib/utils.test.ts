import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("ignores falsy values", () => {
    const condition = 1 > 2;
    expect(cn("foo", condition && "bar", undefined, null, "")).toBe("foo");
  });

  it("resolves conditional classes from objects", () => {
    expect(cn("base", { active: true, hidden: false })).toBe("base active");
  });

  it("lets later tailwind classes win over conflicting earlier ones", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("keeps non-conflicting tailwind classes", () => {
    expect(cn("p-2", "m-4")).toBe("p-2 m-4");
  });
});
