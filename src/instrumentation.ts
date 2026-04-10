/**
 * Secondary hook: fixes broken Node `localStorage` when instrumentation runs.
 * Does not rely on NEXT_RUNTIME === "nodejs" (often unset in dev / Turbopack).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "edge") {
    return;
  }

  const g = globalThis as typeof globalThis & { localStorage?: Storage };
  const ls = g.localStorage;
  if (ls && typeof ls.getItem === "function" && typeof ls.setItem === "function") {
    return;
  }

  const memory = new Map<string, string>();

  g.localStorage = {
    get length() {
      return memory.size;
    },
    clear() {
      memory.clear();
    },
    getItem(key: string) {
      return memory.get(String(key)) ?? null;
    },
    key(index: number) {
      return [...memory.keys()][index] ?? null;
    },
    removeItem(key: string) {
      memory.delete(String(key));
    },
    setItem(key: string, value: string) {
      memory.set(String(key), String(value));
    },
  };
}
