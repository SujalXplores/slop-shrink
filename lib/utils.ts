import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function countWords(value: string): number {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

/** Minimum words a source must have to be worth analyzing. Shared by the
 * client submit gate and the server-side scan validation so they never
 * disagree (a button that enables must lead to an accepted request). */
export const MIN_TOTAL_WORDS = 50;

export type DensityTier = "high" | "mid" | "low";

export function densityTier(score: number): DensityTier {
  if (score >= 70) return "high";
  if (score >= 40) return "mid";
  return "low";
}
