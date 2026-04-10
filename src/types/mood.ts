/** Canonical mood values stored in the database */
export const MOOD_VALUES = ["great", "good", "okay", "low", "rough"] as const;
export type MoodValue = (typeof MOOD_VALUES)[number];

/** Optional stressor tags users can toggle during check-in */
export const STRESSOR_OPTIONS = [
  { id: "exams", label: "Exams" },
  { id: "workload", label: "Workload" },
  { id: "social", label: "Social" },
  { id: "sleep", label: "Sleep" },
  { id: "relationships", label: "Relationships" },
] as const;

/** Row shape returned from Supabase `mood_entries` */
export type MoodEntryRow = {
  id: string;
  user_id: string;
  mood: string;
  stress: number;
  stressors: string[];
  note: string | null;
  created_at: string;
};
