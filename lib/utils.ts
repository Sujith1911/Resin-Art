import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind classes cleanly with clsx and twMerge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number to Indian Rupees currency format (₹).
 * Example: 1499 -> ₹1,499
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats GST breakdown (Default 18% for resin art / craft products in India).
 */
export function calculateGST(amount: number, taxRate: number = 0.18) {
  const taxAmount = amount * (taxRate / (1 + taxRate));
  const basePrice = amount - taxAmount;
  return {
    basePrice: Math.round(basePrice),
    taxAmount: Math.round(taxAmount),
    cgst: Math.round(taxAmount / 2),
    sgst: Math.round(taxAmount / 2),
    total: amount,
  };
}
