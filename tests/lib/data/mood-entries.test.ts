/**
 * AI-generated test file.
 * Prompt used:
 * "Generate unit tests for all implemented functions in the codebase, including at least one integration test
 * that verifies multiple functions working together. Add comments to comply with AI usage policy."
 *
 * Reviewed and edited by: Mike Lango
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

import { getLatestMoodEntry, getMoodEntriesForUser } from "@/lib/data/mood-entries";
import type { MoodEntryRow } from "@/types/mood";

import { createSelectLimitChain } from "../../helpers/supabase-thenable";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";

const mockCreateClient = vi.mocked(createClient);

describe("getMoodEntriesForUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Anonymous users should see empty charts without hitting the table
  it("returns an empty array when there is no signed-in user", async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
      from: vi.fn(),
    } as never);

    const rows = await getMoodEntriesForUser(50);
    expect(rows).toEqual([]);
    expect(mockCreateClient).toHaveBeenCalledTimes(1);
  });

  // Supabase errors are swallowed into an empty list to keep UI resilient
  it("returns an empty array when the query errors", async () => {
    const chain = createSelectLimitChain<MoodEntryRow[]>({ data: [], error: { message: "boom" } });
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "u1" } } }),
      },
      from: vi.fn(() => chain),
    } as never);

    await expect(getMoodEntriesForUser(10)).resolves.toEqual([]);
  });

  // Happy path maps rows for dashboard/trends consumers
  it("returns mood rows for the authenticated user", async () => {
    const sample: MoodEntryRow[] = [
      {
        id: "1",
        user_id: "u1",
        mood: "good",
        stress: 4,
        stressors: ["sleep"],
        note: null,
        created_at: "2026-04-20T10:00:00.000Z",
      },
    ];
    const chain = createSelectLimitChain<MoodEntryRow[]>({ data: sample, error: null });
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "u1" } } }),
      },
      from: vi.fn(() => chain),
    } as never);

    const rows = await getMoodEntriesForUser(120);
    expect(rows).toEqual(sample);
  });
});

describe("getLatestMoodEntry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Completion page reads the freshest log only
  it("returns null when no entries exist", async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
      from: vi.fn(),
    } as never);

    await expect(getLatestMoodEntry()).resolves.toBeNull();
  });

  // Delegates to the same query path as charts, but only needs the head row
  it("returns the newest entry when data exists", async () => {
    const newest: MoodEntryRow = {
      id: "new",
      user_id: "u1",
      mood: "rough",
      stress: 9,
      stressors: ["exams"],
      note: null,
      created_at: "2026-04-23T09:00:00.000Z",
    };
    const chain = createSelectLimitChain<MoodEntryRow[]>({ data: [newest], error: null });
    mockCreateClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "u1" } } }),
      },
      from: vi.fn(() => chain),
    } as never);

    await expect(getLatestMoodEntry()).resolves.toEqual(newest);
  });
});
