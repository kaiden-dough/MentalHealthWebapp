/**
 * AI-generated test file.
 * Prompt used:
 * "Generate unit tests for all implemented functions in the codebase, including at least one integration test
 * that verifies multiple functions working together. Add comments to comply with AI usage policy."
 *
 * Reviewed and edited by: Mike Lango
 */

import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

const updateSessionMock = vi.hoisted(() => vi.fn(async () => new Response("ok", { status: 200 })));

vi.mock("@/lib/supabase/middleware", () => ({
  updateSession: (req: NextRequest) => updateSessionMock(req),
}));

import { middleware } from "@/middleware";

describe("middleware (root)", () => {
  // Root middleware should stay a thin wrapper around session refresh logic
  it("delegates to updateSession with the incoming request", async () => {
    const request = new NextRequest(new URL("http://localhost:3000/dashboard"));
    const response = await middleware(request);

    expect(updateSessionMock).toHaveBeenCalledWith(request);
    expect(response.status).toBe(200);
  });
});
