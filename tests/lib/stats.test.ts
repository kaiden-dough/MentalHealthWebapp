/**
 * AI-generated test file.
 * Prompt used:
 * "Generate unit tests for all implemented functions in the codebase, including at least one integration test
 * that verifies multiple functions working together. Add comments to comply with AI usage policy."
 *
 * Reviewed and edited by: Mike Lango
 */

import { addHours, formatISO, startOfDay, subDays, subHours } from "date-fns";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { computeStreak, countLast7Days } from "@/lib/stats";
import type { MoodEntryRow } from "@/types/mood";

/** Builds a minimal mood row for stats helpers */
function entry(createdAt: string, overrides: Partial<MoodEntryRow> = {}): MoodEntryRow {
  return {
    id: "id",
    user_id: "user",
    mood: "okay",
    stress: 5,
    stressors: [],
    note: null,
    created_at: createdAt,
    ...overrides,
  };
}

describe("countLast7Days", () => {
  let frozenNow: Date;

  beforeEach(() => {
    vi.useFakeTimers();
    frozenNow = new Date("2026-04-23T15:00:00.000Z");
    vi.setSystemTime(frozenNow);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  // Counts rows whose timestamps fall on or after the rolling 7-day window start
  it("counts entries within the last 7 days", () => {
    const windowStart = subDays(startOfDay(frozenNow), 7);
    const rows = [
      entry(formatISO(frozenNow)),
      entry(formatISO(addHours(windowStart, 1))),
      entry(formatISO(subHours(windowStart, 1))), // one hour before window → excluded
    ];
    expect(countLast7Days(rows)).toBe(2);
  });

  // Boundary: exactly at start-of-day minus 7 should be included
  it("treats the window boundary as inclusive at start of day", () => {
    const windowStart = subDays(startOfDay(frozenNow), 7);
    const rows = [entry(formatISO(windowStart))];
    expect(countLast7Days(rows)).toBe(1);
  });

  // Empty history should not throw and should return zero
  it("returns 0 for an empty list", () => {
    expect(countLast7Days([])).toBe(0);
  });
});

describe("computeStreak", () => {
  let frozenNow: Date;

  beforeEach(() => {
    vi.useFakeTimers();
    frozenNow = new Date("2026-04-23T12:00:00.000Z");
    vi.setSystemTime(frozenNow);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  /** Mood row timestamped midday on a calendar day relative to the frozen "now" */
  function localDayEntry(dayOffsetFromToday: number) {
    const day = subDays(startOfDay(frozenNow), dayOffsetFromToday);
    return entry(formatISO(addHours(day, 12)));
  }

  // Streak includes today when a log exists for the current calendar day
  it("counts consecutive days including today", () => {
    const rows = [localDayEntry(0), localDayEntry(1), localDayEntry(2)];
    expect(computeStreak(rows)).toBe(3);
  });

  // If nothing logged today, streak can still start from yesterday
  it("falls back to yesterday when today has no entry", () => {
    const rows = [localDayEntry(1), localDayEntry(2)];
    expect(computeStreak(rows)).toBe(2);
  });

  // First missing day in the past stops the streak counter
  it("stops at the first gap", () => {
    const rows = [localDayEntry(0), localDayEntry(2)];
    expect(computeStreak(rows)).toBe(1);
  });

  // No logs means zero streak
  it("returns 0 when there are no entries", () => {
    expect(computeStreak([])).toBe(0);
  });
});
