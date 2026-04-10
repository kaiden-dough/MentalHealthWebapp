"use client";

import { useActionState } from "react";

import { signUpWithPassword, type AuthFormState } from "@/app/actions/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isSupabaseConfigured } from "@/lib/env";

/**
 * Registration form — may require email confirmation depending on Supabase project settings.
 */
export function SignupForm() {
  const [state, action, pending] = useActionState(signUpWithPassword, undefined as AuthFormState);

  if (!isSupabaseConfigured()) {
    return (
      <Alert>
        <AlertTitle>Configuration needed</AlertTitle>
        <AlertDescription>
          Configure Supabase environment variables before creating an account (see README).
        </AlertDescription>
      </Alert>
    );
  }

  if (state?.message) {
    return (
      <Alert className="border-primary/30 bg-accent/30">
        <AlertTitle>Almost there</AlertTitle>
        <AlertDescription>{state.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <form action={action} className="space-y-4">
      {state?.error ? (
        <Alert variant="destructive">
          <AlertTitle>Could not sign up</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="displayName">Preferred name</Label>
        <Input id="displayName" name="displayName" required maxLength={80} placeholder="Alex" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@vt.edu" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
        />
        <p className="text-xs text-muted-foreground">At least 8 characters.</p>
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
