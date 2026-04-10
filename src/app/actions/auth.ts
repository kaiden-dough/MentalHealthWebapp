"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getSiteUrl } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Use at least 8 characters"),
  displayName: z.string().min(1).max(80),
});

export type AuthFormState = { error?: string; message?: string } | undefined;

/**
 * Signs in with email/password and sends the user to the app dashboard.
 */
export async function signInWithPassword(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Could not sign in. Check your email and password." };
  }

  revalidatePath("/", "layout");
  const next = String(formData.get("next") ?? "").trim();
  const safe = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
  redirect(safe);
}

/**
 * Registers a new account and seeds the profile display name in user metadata.
 */
export async function signUpWithPassword(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    displayName: formData.get("displayName"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid signup data." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        display_name: parsed.data.displayName,
      },
      // Must match Supabase Auth → Redirect URLs and your Vercel NEXT_PUBLIC_SITE_URL (or VERCEL_URL fallback)
      emailRedirectTo: `${getSiteUrl()}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Email confirmation disabled in Supabase → session returned; go straight in
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  return {
    message:
      "Check your email to confirm your account, then sign in. You can close this tab.",
  };
}

/**
 * Ends the session and returns to the marketing home page.
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
