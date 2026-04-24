/**
 * AI-generated test file.
 * Prompt used:
 * "Generate unit tests for all implemented functions in the codebase, including at least one integration test
 * that verifies multiple functions working together. Add comments to comply with AI usage policy."
 *
 * Reviewed and edited by: Mike Lango
 */

import { describe, expect, it } from "vitest";

import { moodToScore } from "@/lib/mood-map";

describe("moodToScore", () => {
  // Maps canonical mood labels to chart-friendly 1–5 scores
  it("maps known moods to expected scores", () => {
    expect(moodToScore("great")).toBe(5);
    expect(moodToScore("good")).toBe(4);
    expect(moodToScore("okay")).toBe(3);
    expect(moodToScore("low")).toBe(2);
    expect(moodToScore("rough")).toBe(1);
  });

  // Unknown labels should not break charts; default to neutral
  it("defaults unknown moods to the neutral score", () => {
    expect(moodToScore("unknown-mood")).toBe(3);
    expect(moodToScore("")).toBe(3);
  });
});
