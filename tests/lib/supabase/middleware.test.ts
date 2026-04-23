/**
 * AI-generated test file.
 * Prompt used:
 * "Generate unit tests for all implemented functions in the codebase, including at least one integration test
 * that verifies multiple functions working together. Add comments to comply with AI usage policy."
 *
 * Reviewed and edited by: Mike Lango
 */

import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const createServerClientMock = vi.hoisted(() => vi.fn());

vi.mock("@supabase/ssr", () => ({
  createServerClient: (...args: unknown[]) => createServerClientMock(...args),
}));

import { updateSession } from "@/lib/supabase/middleware";

describe("updateSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // Without public Supabase env, middleware should not block navigation
  it("passes through when Supabase env vars are missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");

    const request = new NextRequest(new URL("http://localhost:3000/dashboard"));
    const response = await updateSession(request);

    expect(response.status).toBe(200);
    expect(createServerClientMock).not.toHaveBeenCalled();
  });

  // Protected routes require a refreshed user session
  it("redirects anonymous users from protected pages to login", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");

    createServerClientMock.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    });

    const request = new NextRequest(new URL("http://localhost:3000/dashboard"));
    const response = await updateSession(request);

    expect(response.status).toBeGreaterThanOrEqual(300);
    expect(response.headers.get("location") ?? "").toContain("/login");
    expect(response.headers.get("location") ?? "").toContain("next=%2Fdashboard");
  });

  // Authenticated users should not see auth forms again
  it("redirects signed-in users away from /login", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");

    createServerClientMock.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "u1" } } }),
      },
    });

    const request = new NextRequest(new URL("http://localhost:3000/login"));
    const response = await updateSession(request);

    expect(response.headers.get("location") ?? "").toContain("/dashboard");
  });
});
