"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const moodSchema = z.object({
  mood: z.enum(["great", "good", "okay", "low", "rough"]),
  stress: z.number().min(1).max(10),
  stressors: z.array(z.string()).max(12),
  note: z.string().max(2000).optional().nullable(),
});

export type MoodActionState = { error?: string } | undefined;

/**
 * Validates and inserts a mood check-in, then redirects to the feedback screen.
 */
export async function submitMoodEntry(
  _prev: MoodActionState,
  formData: FormData,
): Promise<MoodActionState> {
  const parsed = moodSchema.safeParse({
    mood: formData.get("mood"),
    stress: Number(formData.get("stress")),
    stressors: JSON.parse(String(formData.get("stressors") || "[]")),
    note: formData.get("note") || null,
  });

  if (!parsed.success) {
    return { error: "Please check your entries and try again." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in to save a check-in." };
  }

  const { error } = await supabase.from("mood_entries").insert({
    user_id: user.id,
    mood: parsed.data.mood,
    stress: parsed.data.stress,
    stressors: parsed.data.stressors,
    note: parsed.data.note,
  });

  if (error) {
    console.error(error);
    return { error: "Could not save your check-in. Try again in a moment." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/trends");

  redirect("/check-in/complete");
}
