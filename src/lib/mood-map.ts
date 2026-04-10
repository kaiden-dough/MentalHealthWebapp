import type { MoodValue } from "@/types/mood";

const MOOD_SCORE: Record<MoodValue, number> = {
  great: 5,
  good: 4,
  okay: 3,
  low: 2,
  rough: 1,
};

/**
 * Maps a mood label to a numeric score for charting (1–5).
 */
export function moodToScore(mood: string): number {
  const m = mood as MoodValue;
  return MOOD_SCORE[m] ?? 3;
}
