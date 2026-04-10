"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const settingsSchema = z.object({
  displayName: z.string().min(1, "Name is required").max(80),
});

export type SettingsState = { error?: string; success?: boolean } | undefined;

/**
 * Updates the signed-in user's display name on their profile.
 */
export async function updateDisplayName(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const parsed = settingsSchema.safeParse({
    displayName: formData.get("displayName"),
  });
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors.displayName?.[0] ?? "Invalid name" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      display_name: parsed.data.displayName,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return { error: "Could not update settings." };
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true };
}
