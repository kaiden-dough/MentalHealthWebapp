import { redirect } from "next/navigation";

import { ensureUserProfile } from "@/app/actions/profile";
import { AppShell } from "@/components/layout/app-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

/**
 * Authenticated shell: loads profile and wraps all in-app routes.
 */
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center p-6">
        <Alert>
          <AlertTitle>Connect Supabase</AlertTitle>
          <AlertDescription>
            Add <code className="rounded bg-muted px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="rounded bg-muted px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
            <code className="rounded bg-muted px-1">.env.local</code>, run the SQL in{" "}
            <code className="rounded bg-muted px-1">supabase/migrations/001_initial.sql</code>, then restart{" "}
            <code className="rounded bg-muted px-1">npm run dev</code>.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await ensureUserProfile();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const displayName = profile?.display_name ?? user.email?.split("@")[0] ?? "Hokie";

  return <AppShell displayName={displayName}>{children}</AppShell>;
}
