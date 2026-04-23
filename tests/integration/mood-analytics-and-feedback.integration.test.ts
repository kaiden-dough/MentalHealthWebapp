/**
 * AI-generated test file.
 * Prompt used:
 * "Generate unit tests for all implemented functions in the codebase, including at least one integration test
 * that verifies multiple functions working together. Add comments to comply with AI usage policy."
 *
 * Reviewed and edited by: Mike Lango
 */

import { addHours, formatISO, startOfDay, subDays } from "date-fns";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { computeStreak, countLast7Days } from "@/lib/stats";
import { isNegativeMood, pickAffirmation, pickCopingStrategy } from "@/lib/feedback";
import { moodToScore } from "@/lib/mood-map";
import type { MoodEntryRow } from "@/types/mood";

/**
 * Integration-style scenario: after a streak of check-ins, derive analytics and feedback copy
 * the same way dashboard/trends and the completion screen would.
 * @returns Summary object for assertions
 */
function summarizeStudentExperience(entries: MoodEntryRow[], userSeed: string) {
  const last = entries[0];
  const lastScore = last ? moodToScore(last.mood) : null;
  const negative = last ? isNegativeMood(last.mood) : false;
  const affirmation = pickAffirmation(userSeed);
  const coping = pickCopingStrategy(userSeed);

  return {
    last7: countLast7Days(entries),
    streak: computeStreak(entries),
    lastScore,
    negative,
    affirmation,
    coping,
  };
}

describe("mood analytics + feedback integration", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-23T12:00:00.000Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  // Mirrors a student who checks in across several days then lands on completion UX
  it("combines streak metrics with coping guidance after a low mood entry", () => {
    const now = new Date("2026-04-23T12:00:00.000Z");
    const day = (offset: number) => formatISO(addHours(subDays(startOfDay(now), offset), 12));

    const entries: MoodEntryRow[] = [
      {
        id: "3",
        user_id: "u1",
        mood: "low",
        stress: 8,
        stressors: ["exams"],
        note: "Rough week",
        created_at: day(0),
      },
      {
        id: "2",
        user_id: "u1",
        mood: "good",
        stress: 4,
        stressors: [],
        note: null,
        created_at: day(1),
      },
      {
        id: "1",
        user_id: "u1",
        mood: "okay",
        stress: 5,
        stressors: ["sleep"],
        note: null,
        created_at: day(2),
      },
    ];

    const summary = summarizeStudentExperience(entries, "integration-user");

    expect(summary.last7).toBe(3);
    expect(summary.streak).toBe(3);
    expect(summary.lastScore).toBe(2);
    expect(summary.negative).toBe(true);
    expect(summary.affirmation.length).toBeGreaterThan(20);
    expect(summary.coping.title.length).toBeGreaterThan(3);
    expect(summary.coping.body.length).toBeGreaterThan(20);
  });
});
