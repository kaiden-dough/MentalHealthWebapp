const AFFIRMATIONS = [
  "You belong here. Progress is rarely linear—and that is okay.",
  "Showing up to check in, even on good days, builds the habit of noticing yourself.",
  "Small steps count. You do not have to solve everything today.",
  "Rest is part of doing well, not a reward for burning out.",
];

const COPING_SNIPPETS: { title: string; body: string }[] = [
  {
    title: "Box breathing",
    body: "Inhale for 4, hold for 4, exhale for 4, hold empty for 4. Repeat a few rounds at your own pace.",
  },
  {
    title: "Ground with your senses",
    body: "Name 3 things you see, 2 you can touch, and 1 sound you hear. Move slowly.",
  },
  {
    title: "Shrink the next step",
    body: "What is one tiny action in the next 10 minutes that would feel slightly kinder? Start there.",
  },
  {
    title: "Body reset",
    body: "Unclench your jaw and drop your shoulders. Let your exhale be a little longer than your inhale.",
  },
];

/**
 * Returns true when the logged mood should surface a coping strategy instead of only affirmation.
 */
export function isNegativeMood(mood: string): boolean {
  return mood === "low" || mood === "rough";
}

/**
 * Picks a stable-random affirmation from the curated pool (no external LLM).
 */
export function pickAffirmation(seed: string): string {
  const idx = hashString(seed) % AFFIRMATIONS.length;
  return AFFIRMATIONS[idx]!;
}

/**
 * Picks a coping snippet from the curated pool using the seed for variety across sessions.
 */
export function pickCopingStrategy(seed: string): { title: string; body: string } {
  const idx = hashString(seed) % COPING_SNIPPETS.length;
  return COPING_SNIPPETS[idx]!;
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}
