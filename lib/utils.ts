import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function countWords(value: string): number {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

/** Minimum words a source needs before it is worth analyzing; shared by the client submit gate and server validation. */
export const MIN_TOTAL_WORDS = 50;

export type DensityTier = "high" | "mid" | "low";

export function densityTier(score: number): DensityTier {
  if (score >= 70) return "high";
  if (score >= 40) return "mid";
  return "low";
}

export const WORDS_PER_MINUTE = 230;

/** Formats minutes saved as seconds under a minute, half-minutes below ten, whole minutes above. */
export function formatReadingTimeSaved(minutes: number): {
  value: string;
  unit: "sec" | "min";
} {
  const totalSeconds = Math.max(0, Math.round(minutes * 60));
  if (totalSeconds < 60) {
    return { value: String(totalSeconds), unit: "sec" };
  }
  const mins = totalSeconds / 60;
  const rounded = mins < 10 ? Math.round(mins * 2) / 2 : Math.round(mins);
  return { value: String(rounded), unit: "min" };
}
