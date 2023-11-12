import { useRef } from "react"

const useMatrixRef = () => useRef<HTMLInputElement>(null)

export const useMatrixRefs = (rows: number, cols: number) => {
  const baseMatrix = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => useMatrixRef()),
  )
  return baseMatrix
}
