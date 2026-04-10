import { redirect } from "next/navigation";

import { SettingsForm } from "@/components/settings/settings-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Settings",
};

/**
 * Profile + privacy copy (preferences can extend to a `user_settings` table later).
 */
export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();

  const initial = profile?.display_name ?? user?.email?.split("@")[0] ?? "";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">Control how HokieHealth addresses you.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Profile</CardTitle>
          <CardDescription>Stored with your Supabase account.</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm initialDisplayName={initial} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Privacy</CardTitle>
          <CardDescription>What we optimize for in this class project.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Mood entries are scoped to your user ID via Row Level Security in Supabase. We don&apos;t sell data or
            run ads.
          </p>
          <Separator />
          <p>
            This app is <strong>not</strong> a clinical service. Use campus crisis resources or emergency services
            when needed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
