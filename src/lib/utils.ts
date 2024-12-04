import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateMinutes(value: string): boolean {
  return /^[1-9]\d{0,2}$/.test(value) && Number.isInteger(Number(value));
}

export function parseMinutes(value: string): number {
  return parseInt(value, 10);
}
