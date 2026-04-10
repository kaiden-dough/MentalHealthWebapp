import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client for Client Components (reads session from cookies).
 * @returns Configured Supabase client or throws if env vars are missing
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return createBrowserClient(url, key);
}
