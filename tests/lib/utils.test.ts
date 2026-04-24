/**
 * AI-generated test file.
 * Prompt used:
 * "Generate unit tests for all implemented functions in the codebase, including at least one integration test
 * that verifies multiple functions working together. Add comments to comply with AI usage policy."
 *
 * Reviewed and edited by: Mike Lango
 */

import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn", () => {
  // Merges conflicting Tailwind utilities toward the last intent
  it("merges class lists and resolves tailwind conflicts", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  // Ignores falsy fragments like undefined or false from conditional classes
  it("drops falsy inputs", () => {
    expect(cn("text-sm", false && "hidden", undefined, "font-medium")).toBe("text-sm font-medium");
  });

  // Accepts a single string for simple call sites
  it("returns a single class string unchanged when no conflict", () => {
    expect(cn("flex gap-2")).toBe("flex gap-2");
  });
});
