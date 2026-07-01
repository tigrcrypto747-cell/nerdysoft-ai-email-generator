import { cn } from "@/lib/utils";

describe("cn()", () => {
  it("returns a single class unchanged", () => {
    expect(cn("foo")).toBe("foo");
  });

  it("combines multiple class strings", () => {
    expect(cn("foo", "bar", "baz")).toBe("foo bar baz");
  });

  it("ignores falsy values (false, null, undefined)", () => {
    expect(cn("foo", false, null, undefined, "bar")).toBe("foo bar");
  });

  it("ignores empty strings", () => {
    expect(cn("foo", "", "bar")).toBe("foo bar");
  });

  it("resolves Tailwind conflicts — last class wins", () => {
    // tailwind-merge: p-4 overrides p-2
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("resolves Tailwind color conflicts", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("preserves non-conflicting Tailwind classes", () => {
    const result = cn("flex", "items-center", "gap-2");
    expect(result).toBe("flex items-center gap-2");
  });

  it("handles object syntax (clsx feature)", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
  });

  it("handles array syntax (clsx feature)", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  it("returns empty string when given no classes", () => {
    expect(cn()).toBe("");
  });
});
