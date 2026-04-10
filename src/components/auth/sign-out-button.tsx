"use client";

import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type SignOutButtonProps = {
  variant?: "default" | "menu";
  className?: string;
};

/**
 * Triggers the server sign-out action (works from client event handlers).
 */
export function SignOutButton({ variant = "default", className }: SignOutButtonProps) {
  if (variant === "menu") {
    return (
      <DropdownMenuItem
        className={cn("cursor-pointer", className)}
        onSelect={(e) => {
          e.preventDefault();
          void signOut();
        }}
      >
        Sign out
      </DropdownMenuItem>
    );
  }

  return (
    <Button
      type="button"
      variant="secondary"
      className={cn(className)}
      onClick={() => void signOut()}
    >
      Sign out
    </Button>
  );
}
