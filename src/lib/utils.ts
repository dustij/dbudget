import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isClient() {
  return typeof window !== "undefined"
}

export function formatCurrency(amount: string | number, dollarSign = false) {
  if (typeof amount === "string") amount = parseFloat(amount)
  const USD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })
  if (dollarSign) return USD.format(amount)
  return USD.format(amount).replace("$", "").replace(",", "")
}

export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
  )
}
