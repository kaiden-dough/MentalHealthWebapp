/**
 * Minimal PostgREST-style builders for mocking @supabase/supabase-js in Vitest.
 */

/**
 * Creates a chain awaited as: `from().select().eq().order().limit()`.
 * @param resolution Payload resolved when the chain is awaited
 * @returns Builder object compatible with Supabase-style awaiting
 */
export function createSelectLimitChain<T>(resolution: { data: T; error: unknown }) {
  const terminal = {
    then(onFulfilled: (value: typeof resolution) => unknown, onRejected?: (reason: unknown) => unknown) {
      return Promise.resolve(resolution).then(onFulfilled, onRejected);
    },
    catch(onRejected: (reason: unknown) => unknown) {
      return Promise.resolve(resolution).catch(onRejected);
    },
  };
  const builder: Record<string, () => unknown> = {
    select: () => builder,
    eq: () => builder,
    order: () => builder,
    limit: () => terminal,
  };
  return builder;
}

/**
 * Creates a chain awaited as: `from().upsert().select().single()`.
 * @param resolution Payload resolved when `.single()` is awaited
 * @returns Builder object for settings-style profile upserts
 */
export function createUpsertSelectSingleChain<T>(resolution: { data: T; error: unknown }) {
  const builder: Record<string, () => unknown> = {
    upsert: () => builder,
    select: () => builder,
    single: () => Promise.resolve(resolution),
  };
  return builder;
}
