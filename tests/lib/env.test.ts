/**
 * AI-generated test file.
 * Prompt used:
 * "Generate unit tests for all implemented functions in the codebase, including at least one integration test
 * that verifies multiple functions working together. Add comments to comply with AI usage policy."
 *
 * Reviewed and edited by: Mike Lango
 */

import { afterEach, describe, expect, it, vi } from "vitest";

import { getSiteUrl, isSupabaseConfigured } from "@/lib/env";

describe("isSupabaseConfigured", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // Both public client vars must be non-empty strings
  it("returns true when URL and anon key are present", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
    expect(isSupabaseConfigured()).toBe(true);
  });

  // Missing either value disables client features
  it("returns false when a value is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "key");
    expect(isSupabaseConfigured()).toBe(false);
  });
});

describe("getSiteUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // Production deployments should prefer the explicit marketing/app URL
  it("uses NEXT_PUBLIC_SITE_URL when set and strips trailing slashes", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://app.example.com///");
    vi.stubEnv("VERCEL_URL", "should-not-win.example.com");
    expect(getSiteUrl()).toBe("https://app.example.com");
  });

  // Vercel provides host without scheme; we normalize to https
  it("falls back to https VERCEL_URL when explicit site URL absent", () => {
    vi.stubEnv("VERCEL_URL", "my-app.vercel.app/");
    expect(getSiteUrl()).toBe("https://my-app.vercel.app");
  });

  // Local dev default keeps auth redirects predictable
  it("defaults to localhost when nothing else is configured", () => {
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });
});
