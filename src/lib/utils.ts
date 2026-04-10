import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind class names without conflicts.
 * @param inputs Class values from clsx
 * @returns A single merged class string for the DOM
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
