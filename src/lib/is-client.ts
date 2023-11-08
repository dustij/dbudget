/**
 * Checks if the code is running on the client-side (browser).
 * Returns true if the code is running on the client-side (browser), otherwise returns false.
 */
export function isClient() {
  return typeof window !== "undefined"
}
