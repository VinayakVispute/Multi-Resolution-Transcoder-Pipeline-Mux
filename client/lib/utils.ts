import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const statusColor: { [key: string]: string } = {
  FINISHED: "bg-green-500 text-green-50",
  PENDING: "bg-yellow-500 text-yellow-50",
  FAILED: "bg-red-500 text-red-50",
};
