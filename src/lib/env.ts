/**
 * Returns whether Supabase public env vars are present (required for auth and persistence).
 */
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.length && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length
  );
}

/**
 * Base URL for auth email links and absolute redirects.
 * Prefer NEXT_PUBLIC_SITE_URL (set per environment). On Vercel, falls back to VERCEL_URL
 * so confirmation emails work if the explicit site URL was not set.
 *
 * @returns Origin with no trailing slash, e.g. https://your-app.vercel.app or http://localhost:3000
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/+$/, "");
  }
  // Vercel sets VERCEL_URL like "my-app.vercel.app" (no scheme)
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return `https://${vercel.replace(/\/+$/, "")}`;
  }
  return "http://localhost:3000";
}
