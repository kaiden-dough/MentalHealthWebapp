/**
 * AI-generated test file.
 * Prompt used:
 * "Generate unit tests for all implemented functions in the codebase, including at least one integration test
 * that verifies multiple functions working together. Add comments to comply with AI usage policy."
 *
 * Reviewed and edited by: Mike Lango
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

const redirectMock = vi.hoisted(() =>
  vi.fn((url: string) => {
    throw new Error(`redirect:${url}`);
  }),
);

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: (url: string) => redirectMock(url),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { revalidatePath } from "next/cache";

import { signInWithPassword, signOut, signUpWithPassword } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";

const mockCreateClient = vi.mocked(createClient);

function form(entries: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(entries)) {
    fd.set(k, v);
  }
  return fd;
}

describe("signInWithPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    redirectMock.mockImplementation((url: string) => {
      throw new Error(`redirect:${url}`);
    });
  });

  // Zod should block malformed emails before Supabase is contacted
  it("returns a friendly error when validation fails", async () => {
    mockCreateClient.mockResolvedValue({} as never);
    const result = await signInWithPassword(undefined, form({ email: "bad", password: "secret1" }));
    expect(result?.error).toBe("Enter a valid email and password.");
    expect(mockCreateClient).not.toHaveBeenCalled();
  });

  // Supabase auth failures map to a generic sign-in message
  it("returns an error when Supabase rejects credentials", async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          error: { message: "Invalid login credentials" },
        }),
      },
    } as never);

    const result = await signInWithPassword(
      undefined,
      form({ email: "user@vt.edu", password: "secret12" }),
    );
    expect(result?.error).toBe("Could not sign in. Check your email and password.");
  });

  // Successful login should revalidate and redirect to a safe internal path
  it("redirects to next when it is a safe relative URL", async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
      },
    } as never);

    await expect(
      signInWithPassword(undefined, form({ email: "user@vt.edu", password: "secret12", next: "/trends" })),
    ).rejects.toThrow("redirect:/trends");
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  // Open redirects should be ignored
  it("defaults redirect to /dashboard when next is unsafe", async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
      },
    } as never);

    await expect(
      signInWithPassword(
        undefined,
        form({ email: "user@vt.edu", password: "secret12", next: "//evil.com" }),
      ),
    ).rejects.toThrow("redirect:/dashboard");
  });
});

describe("signUpWithPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    redirectMock.mockImplementation((url: string) => {
      throw new Error(`redirect:${url}`);
    });
  });

  // Password policy from zod surfaces to the UI
  it("returns validation feedback for weak signup payloads", async () => {
    const result = await signUpWithPassword(
      undefined,
      form({ email: "user@vt.edu", password: "short", displayName: "Mike" }),
    );
    expect(result?.error).toContain("8 characters");
    expect(mockCreateClient).not.toHaveBeenCalled();
  });

  // When Supabase returns a session, user should land in the app immediately
  it("redirects to the dashboard when a session is returned", async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        signUp: vi.fn().mockResolvedValue({
          data: { session: { access_token: "t" } },
          error: null,
        }),
      },
    } as never);

    await expect(
      signUpWithPassword(
        undefined,
        form({ email: "user@vt.edu", password: "password10", displayName: "Mike" }),
      ),
    ).rejects.toThrow("redirect:/dashboard");
  });

  // Email confirmation flow should instruct the user instead of redirecting
  it("returns a confirmation message when no session is created", async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        signUp: vi.fn().mockResolvedValue({
          data: { session: null },
          error: null,
        }),
      },
    } as never);

    const result = await signUpWithPassword(
      undefined,
      form({ email: "user@vt.edu", password: "password10", displayName: "Mike" }),
    );
    expect(result?.message).toContain("Check your email");
  });

  // Supabase signup errors (duplicate email, weak password on provider, etc.) bubble to the UI
  it("returns the Supabase error message when sign up fails", async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        signUp: vi.fn().mockResolvedValue({
          data: { session: null },
          error: { message: "User already registered" },
        }),
      },
    } as never);

    const result = await signUpWithPassword(
      undefined,
      form({ email: "user@vt.edu", password: "password10", displayName: "Mike" }),
    );
    expect(result?.error).toBe("User already registered");
  });
});

describe("signOut", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    redirectMock.mockImplementation((url: string) => {
      throw new Error(`redirect:${url}`);
    });
  });

  // Sign-out clears server state then returns user to marketing home
  it("signs out, revalidates, and redirects home", async () => {
    const signOutFn = vi.fn().mockResolvedValue(undefined);
    mockCreateClient.mockResolvedValue({
      auth: { signOut: signOutFn },
    } as never);

    await expect(signOut()).rejects.toThrow("redirect:/");
    expect(signOutFn).toHaveBeenCalledTimes(1);
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });
});
