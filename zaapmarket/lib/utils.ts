import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (value: bigint | number): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};