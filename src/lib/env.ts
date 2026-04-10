/**
 * Returns whether Supabase public env vars are present (required for auth and persistence).
 */
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.length && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length
  );
}
