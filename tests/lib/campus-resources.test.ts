/**
 * AI-generated test file.
 * Prompt used:
 * "Generate unit tests for all implemented functions in the codebase, including at least one integration test
 * that verifies multiple functions working together. Add comments to comply with AI usage policy."
 *
 * Reviewed and edited by: Mike Lango
 */

import { describe, expect, it } from "vitest";

import { CAMPUS_RESOURCES, type CampusResource } from "@/lib/campus-resources";

describe("CAMPUS_RESOURCES", () => {
  // Crisis resources must be present for compliance with student safety expectations
  it("includes at least one crisis resource with an https link", () => {
    const crisis = CAMPUS_RESOURCES.filter((r) => r.category === "crisis");
    expect(crisis.length).toBeGreaterThan(0);
    expect(crisis.every((r) => r.href.startsWith("https://"))).toBe(true);
  });

  // IDs are used as React keys and for deep links; enforce uniqueness
  it("uses unique string ids across the catalog", () => {
    const ids = CAMPUS_RESOURCES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  // Every row should satisfy the narrow union type for UI grouping
  it("only uses allowed categories", () => {
    const allowed: CampusResource["category"][] = ["crisis", "counseling", "wellness"];
    for (const row of CAMPUS_RESOURCES) {
      expect(allowed).toContain(row.category);
    }
  });

  // Empty titles or descriptions would render broken cards
  it("requires non-empty display fields", () => {
    for (const row of CAMPUS_RESOURCES) {
      expect(row.title.trim().length).toBeGreaterThan(0);
      expect(row.description.trim().length).toBeGreaterThan(0);
      expect(row.href.trim().length).toBeGreaterThan(0);
    }
  });
});
