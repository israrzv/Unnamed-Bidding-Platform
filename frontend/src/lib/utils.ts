import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Conditionally join and de-duplicate Tailwind class names. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
