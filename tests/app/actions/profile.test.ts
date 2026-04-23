/**
 * AI-generated test file.
 * Prompt used:
 * "Generate unit tests for all implemented functions in the codebase, including at least one integration test
 * that verifies multiple functions working together. Add comments to comply with AI usage policy."
 *
 * Reviewed and edited by: Mike Lango
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { ensureUserProfile } from "@/app/actions/profile";
import { createClient } from "@/lib/supabase/server";

const mockCreateClient = vi.mocked(createClient);

describe("ensureUserProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // No email means there is nothing friendly to seed
  it("returns early when the user has no email", async () => {
    const upsert = vi.fn();
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "u1", email: undefined } } }),
      },
      from: vi.fn(() => ({ upsert })),
    } as never);

    await ensureUserProfile();
    expect(upsert).not.toHaveBeenCalled();
  });

  // First-time users get a profile row derived from their email handle
  it("upserts a profile using the email local-part as display name", async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "u1", email: "mike.lango@vt.edu" } } }),
      },
      from: vi.fn(() => ({ upsert })),
    } as never);

    await ensureUserProfile();
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "u1",
        display_name: "mike.lango",
      }),
      { onConflict: "id" },
    );
  });
});
