import { format, parseISO, startOfDay, subDays } from "date-fns";

import type { MoodEntryRow } from "@/types/mood";

/**
 * Counts check-ins in the rolling last 7 days.
 */
export function countLast7Days(entries: MoodEntryRow[]): number {
  const since = subDays(startOfDay(new Date()), 7);
  return entries.filter((e) => parseISO(e.created_at) >= since).length;
}

/**
 * Computes a daily streak: consecutive days with at least one log, counting back from today or yesterday.
 */
export function computeStreak(entries: MoodEntryRow[]): number {
  const days = new Set(
    entries.map((e) => format(startOfDay(parseISO(e.created_at)), "yyyy-MM-dd")),
  );
  let cursor = startOfDay(new Date());
  const todayKey = format(cursor, "yyyy-MM-dd");
  if (!days.has(todayKey)) {
    cursor = subDays(cursor, 1);
  }
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const key = format(cursor, "yyyy-MM-dd");
    if (days.has(key)) {
      streak++;
      cursor = subDays(cursor, 1);
    } else {
      break;
    }
  }
  return streak;
}
