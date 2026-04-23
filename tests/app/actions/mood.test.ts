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

import { submitMoodEntry } from "@/app/actions/mood";
import { createClient } from "@/lib/supabase/server";

const mockCreateClient = vi.mocked(createClient);

function moodForm(overrides: Partial<Record<string, string>> = {}): FormData {
  const fd = new FormData();
  fd.set("mood", overrides.mood ?? "okay");
  fd.set("stress", overrides.stress ?? "5");
  fd.set("stressors", overrides.stressors ?? JSON.stringify(["exams"]));
  fd.set("note", overrides.note ?? "");
  return fd;
}

describe("submitMoodEntry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    redirectMock.mockImplementation((url: string) => {
      throw new Error(`redirect:${url}`);
    });
  });

  // Zod rejects impossible stress values before touching the database
  it("returns a validation error for out-of-range stress", async () => {
    const result = await submitMoodEntry(undefined, moodForm({ stress: "99" }));
    expect(result?.error).toBe("Please check your entries and try again.");
    expect(mockCreateClient).not.toHaveBeenCalled();
  });

  // Enum guard keeps only canonical mood labels in the table
  it("returns a validation error for unknown mood labels", async () => {
    const result = await submitMoodEntry(undefined, moodForm({ mood: "ecstatic" }));
    expect(result?.error).toBe("Please check your entries and try again.");
  });

  // Anonymous submissions should never insert rows
  it("returns an error when the user is not authenticated", async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
      from: vi.fn(),
    } as never);

    const result = await submitMoodEntry(undefined, moodForm());
    expect(result?.error).toBe("You need to be signed in to save a check-in.");
  });

  // Database failures should map to a retryable message
  it("returns an error when insert fails", async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "u1" } } }),
      },
      from: vi.fn(() => ({
        insert: vi.fn().mockResolvedValue({ error: { message: "rls" } }),
      })),
    } as never);

    const result = await submitMoodEntry(undefined, moodForm());
    expect(result?.error).toBe("Could not save your check-in. Try again in a moment.");
  });

  // Successful insert should refresh summaries and move to the feedback route
  it("inserts, revalidates, and redirects to the completion screen", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "u1" } } }),
      },
      from: vi.fn(() => ({ insert })),
    } as never);

    await expect(submitMoodEntry(undefined, moodForm())).rejects.toThrow("redirect:/check-in/complete");
    expect(insert).toHaveBeenCalledTimes(1);
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(revalidatePath).toHaveBeenCalledWith("/trends");
  });

  // Malformed stressors JSON currently throws — document behavior for maintainers
  it("throws when stressors JSON is invalid", async () => {
    await expect(submitMoodEntry(undefined, moodForm({ stressors: "{not-json" }))).rejects.toThrow();
  });
});
