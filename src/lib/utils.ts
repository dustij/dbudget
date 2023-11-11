import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isClient() {
  return typeof window !== "undefined"
}

export function formatCurrency(
  amount: string | number | undefined,
  dollarSign = true,
) {
  if (amount === undefined) return ""
  if (typeof amount === "string") amount = parseFloat(amount)
  const USD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })
  if (dollarSign) return USD.format(amount)
  return USD.format(amount).replace("$", "").replace(",", "")
}
