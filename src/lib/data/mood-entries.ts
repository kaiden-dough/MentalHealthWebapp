import { createClient } from "@/lib/supabase/server";
import type { MoodEntryRow } from "@/types/mood";

/**
 * Loads recent mood entries for charts and summaries (newest first).
 */
export async function getMoodEntriesForUser(limit = 120): Promise<MoodEntryRow[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("mood_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []) as MoodEntryRow[];
}

/**
 * Returns the most recent check-in for post-submit feedback.
 */
export async function getLatestMoodEntry(): Promise<MoodEntryRow | null> {
  const rows = await getMoodEntriesForUser(1);
  return rows[0] ?? null;
}
