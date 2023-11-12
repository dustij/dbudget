import { useRef } from "react"

export const useMatrixRefs = (rows: number, cols: number) => {
  const baseMatrix = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => useRef<HTMLInputElement>(null)),
  )
  return baseMatrix
}
