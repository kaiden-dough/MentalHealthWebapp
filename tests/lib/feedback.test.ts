/**
 * AI-generated test file.
 * Prompt used:
 * "Generate unit tests for all implemented functions in the codebase, including at least one integration test
 * that verifies multiple functions working together. Add comments to comply with AI usage policy."
 *
 * Reviewed and edited by: Mike Lango
 */

import { describe, expect, it } from "vitest";

import { isNegativeMood, pickAffirmation, pickCopingStrategy } from "@/lib/feedback";

describe("isNegativeMood", () => {
  // Surfaces coping content for low/rough moods only
  it("returns true for low and rough", () => {
    expect(isNegativeMood("low")).toBe(true);
    expect(isNegativeMood("rough")).toBe(true);
  });

  // Neutral or positive moods should not trigger coping-only treatment
  it("returns false for other moods", () => {
    expect(isNegativeMood("okay")).toBe(false);
    expect(isNegativeMood("great")).toBe(false);
  });

  // Typos should be treated as non-negative for safety/consistency
  it("returns false for invalid labels", () => {
    expect(isNegativeMood("LOW")).toBe(false);
    expect(isNegativeMood("")).toBe(false);
  });
});

describe("pickAffirmation", () => {
  // Same seed should pick the same copy for stable UX
  it("is deterministic for a given seed", () => {
    const a = pickAffirmation("user-123-session");
    const b = pickAffirmation("user-123-session");
    expect(a).toBe(b);
    expect(a.length).toBeGreaterThan(10);
  });

  // Different seeds can rotate variety without external services
  it("can vary output across seeds", () => {
    const pool = new Set<string>();
    for (let i = 0; i < 40; i++) {
      pool.add(pickAffirmation(`seed-${i}`));
    }
    expect(pool.size).toBeGreaterThan(1);
  });
});

describe("pickCopingStrategy", () => {
  // Coping snippets stay stable per seed like affirmations
  it("returns a titled snippet deterministically", () => {
    const first = pickCopingStrategy("abc");
    const second = pickCopingStrategy("abc");
    expect(first).toEqual(second);
    expect(first.title.length).toBeGreaterThan(0);
    expect(first.body.length).toBeGreaterThan(0);
  });
});
