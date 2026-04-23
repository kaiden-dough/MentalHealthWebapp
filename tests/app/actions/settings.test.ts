/**
 * AI-generated test file.
 * Prompt used:
 * "Generate unit tests for all implemented functions in the codebase, including at least one integration test
 * that verifies multiple functions working together. Add comments to comply with AI usage policy."
 *
 * Reviewed and edited by: Mike Lango
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { revalidatePath } from "next/cache";

import { updateDisplayName } from "@/app/actions/settings";
import { createClient } from "@/lib/supabase/server";

import { createUpsertSelectSingleChain } from "../../helpers/supabase-thenable";

const mockCreateClient = vi.mocked(createClient);

function nameForm(name: string): FormData {
  const fd = new FormData();
  fd.set("displayName", name);
  return fd;
}

describe("updateDisplayName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Empty names should not hit Supabase (whitespace-only still has length, so use a true empty value)
  it("returns validation errors for empty display names", async () => {
    const result = await updateDisplayName(undefined, nameForm(""));
    expect(result?.error).toBeTruthy();
    expect(mockCreateClient).not.toHaveBeenCalled();
  });

  // Auth is required for profile mutations
  it("returns an error when the user is not signed in", async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
      from: vi.fn(),
    } as never);

    const result = await updateDisplayName(undefined, nameForm("Mike"));
    expect(result?.error).toBe("Not signed in.");
  });

  // Supabase failures bubble up as a generic settings error
  it("returns an error when the upsert fails", async () => {
    const chain = createUpsertSelectSingleChain({ data: null, error: { message: "fail" } });
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "u1" } } }),
      },
      from: vi.fn(() => chain),
    } as never);

    const result = await updateDisplayName(undefined, nameForm("Mike"));
    expect(result?.error).toBe("Could not update settings.");
  });

  // Successful updates should refresh key surfaces and signal success
  it("upserts the profile and marks success", async () => {
    const chain = createUpsertSelectSingleChain({ data: { id: "u1" }, error: null });
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "u1" } } }),
      },
      from: vi.fn(() => chain),
    } as never);

    const result = await updateDisplayName(undefined, nameForm("Mike"));
    expect(result?.success).toBe(true);
    expect(revalidatePath).toHaveBeenCalledWith("/settings");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
  });
});
