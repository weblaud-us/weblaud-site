import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

/** Whole-dollar USD, e.g. 12500 -> "$12,500". */
export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount)
}
