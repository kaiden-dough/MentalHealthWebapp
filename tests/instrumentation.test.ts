/**
 * AI-generated test file.
 * Prompt used:
 * "Generate unit tests for all implemented functions in the codebase, including at least one integration test
 * that verifies multiple functions working together. Add comments to comply with AI usage policy."
 *
 * Reviewed and edited by: Mike Lango
 */

import { afterEach, describe, expect, it, vi } from "vitest";

import { register } from "@/instrumentation";

describe("register (instrumentation)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // Edge runtime should not attempt Node polyfills
  it("returns immediately on the edge runtime", async () => {
    vi.stubEnv("NEXT_RUNTIME", "edge");
    await expect(register()).resolves.toBeUndefined();
  });

  // Broken Node localStorage should be replaced with an in-memory implementation
  it("installs a working in-memory localStorage when native storage is unusable", async () => {
    vi.stubEnv("NEXT_RUNTIME", "nodejs");

    const globalRef = globalThis as typeof globalThis & { localStorage?: Storage };
    const original = globalRef.localStorage;

    // Simulate a broken localStorage implementation
    globalRef.localStorage = {} as Storage;

    await register();

    globalRef.localStorage!.setItem("k", "v");
    expect(globalRef.localStorage!.getItem("k")).toBe("v");

    globalRef.localStorage = original;
  });
});
