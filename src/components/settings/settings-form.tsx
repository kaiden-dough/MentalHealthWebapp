"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { updateDisplayName, type SettingsState } from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SettingsFormProps = {
  initialDisplayName: string;
};

/**
 * Updates how your first name appears in the app shell greeting.
 */
export function SettingsForm({ initialDisplayName }: SettingsFormProps) {
  const [state, action, pending] = useActionState(updateDisplayName, undefined as SettingsState);

  useEffect(() => {
    if (state?.success) {
      toast.success("Settings saved.");
    }
  }, [state?.success]);

  return (
    <form action={action} className="space-y-4 max-w-md">
      {state?.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="displayName">Display name</Label>
        <Input
          id="displayName"
          name="displayName"
          defaultValue={initialDisplayName}
          required
          maxLength={80}
        />
        <p className="text-xs text-muted-foreground">Shown in the sidebar and greetings.</p>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
