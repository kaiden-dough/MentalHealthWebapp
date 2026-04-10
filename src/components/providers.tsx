"use client";

import dynamic from "next/dynamic";

/**
 * Toaster only mounts in the browser — avoids any SSR touching storage/DOM quirks.
 */
const Toaster = dynamic(
  () => import("sonner").then((m) => ({ default: m.Toaster })),
  { ssr: false },
);

/**
 * Client-side shell: toast notifications.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster richColors position="top-center" closeButton />
    </>
  );
}
