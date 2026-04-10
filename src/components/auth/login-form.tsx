"use client";

import { useActionState } from "react";

import { signInWithPassword, type AuthFormState } from "@/app/actions/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isSupabaseConfigured } from "@/lib/env";

type LoginFormProps = {
  /** Post-login redirect when middleware sent ?next= */
  nextPath?: string;
};

/**
 * Email/password sign-in form with server-side validation feedback.
 */
export function LoginForm({ nextPath }: LoginFormProps) {
  const [state, action, pending] = useActionState(signInWithPassword, undefined as AuthFormState);

  if (!isSupabaseConfigured()) {
    return (
      <Alert>
        <AlertTitle>Configuration needed</AlertTitle>
        <AlertDescription>
          Add <code className="rounded bg-muted px-1 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">.env.local</code>, then restart the dev server.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form action={action} className="space-y-4">
      {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
      {state?.error ? (
        <Alert variant="destructive">
          <AlertTitle>Sign-in failed</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
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
          autoComplete="current-password"
          required
          minLength={6}
        />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
