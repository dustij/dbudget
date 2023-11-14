import { useRef } from "react"

export const useRefsMatrix = (rows: number, cols: number) => {
  // https://react.dev/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback
  const refsMatrix = useRef<(HTMLInputElement | null)[][]>([])
  // initialize all refs to null
  for (const i of Array(rows).keys()) {
    refsMatrix.current[i] = []
    for (const j of Array(cols).keys()) {
      // we just initialized refsMatrix.current[i] to [], so it's safe to use a non-null assertion here
      refsMatrix.current[i]![j] = null
    }
  }
  return refsMatrix
}
