/**
 * AI-generated test file.
 * Prompt used:
 * "Generate unit tests for all implemented functions in the codebase, including at least one integration test
 * that verifies multiple functions working together. Add comments to comply with AI usage policy."
 *
 * Reviewed and edited by: Mike Lango
 */

import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { GET } from "@/app/auth/callback/route";
import { createClient } from "@/lib/supabase/server";

const mockCreateClient = vi.mocked(createClient);

describe("auth callback GET", () => {
  // Happy path exchanges the OAuth code and sends the user to their intended page
  it("redirects to next when code exchange succeeds", async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({ error: null }),
      },
    } as never);

    const request = new Request("http://localhost:3000/auth/callback?code=abc&next=/trends");
    const response = await GET(request);

    expect(response.headers.get("location")).toBe("http://localhost:3000/trends");
  });

  // Missing/invalid codes should surface a login error state
  it("redirects to login with an error when no code is present", async () => {
    const request = new Request("http://localhost:3000/auth/callback");
    const response = await GET(request);

    expect(response.headers.get("location")).toBe("http://localhost:3000/login?error=auth");
  });

  // Supabase failures should also land on the login error route
  it("redirects to login when code exchange fails", async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({ error: { message: "bad" } }),
      },
    } as never);

    const request = new Request("http://localhost:3000/auth/callback?code=bad");
    const response = await GET(request);

    expect(response.headers.get("location")).toBe("http://localhost:3000/login?error=auth");
  });
});
