/**
 * Patches a broken global `localStorage` in Node (e.g. `--localstorage-file` without a path).
 * Imported from `next.config.ts` so it runs before dev SSR / Turbopack workers.
 */
function patch(): void {
  if (typeof window !== "undefined") {
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

patch();
