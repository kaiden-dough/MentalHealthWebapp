"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Ensures a profile row exists for the current user (friendly display name from email).
 */
export async function ensureUserProfile(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return;

  const shortName = user.email.split("@")[0] ?? "Hokie";

  await supabase.from("profiles").upsert(
    {
      id: user.id,
      display_name: shortName,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
}
