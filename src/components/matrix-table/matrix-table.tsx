"use client"

import { useState, type FC, useCallback } from "react"
import { cn } from "~/lib/utils"
import { useRefsMatrix } from "./hooks"

interface MatrixTableProps {
  className?: string
}

const MatrixTable: FC<MatrixTableProps> = ({ className }) => {
  const refsMatrix = useRefsMatrix(10, 13)

  const [componentsMatrix, setComponentsMatrix] = useState(
    refsMatrix.current.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <input
          key={`${rowIndex}-${colIndex}`}
          className="w-full"
          ref={(input) => {
            refsMatrix.current[rowIndex]![colIndex] = input
          }}
          onBlur={(e) => handleSubmit(e)}
          onKeyDown={(e) => {
            if ((e.key === "Enter" && !e.shiftKey) || e.key === "ArrowDown") {
              e.stopPropagation()
              // Move focus to the next input one row down in the same column
              const nextRowIndex = rowIndex + 1
              if (nextRowIndex < refsMatrix.current.length) {
                refsMatrix.current[nextRowIndex]?.[colIndex]?.focus()
              }
            } else if (
              (e.key === "Enter" && e.shiftKey) ||
              e.key === "ArrowUp"
            ) {
              e.stopPropagation()
              // Move focus to the previous input one row up in the same column
              const prevRowIndex = rowIndex - 1
              if (prevRowIndex >= 0) {
                refsMatrix.current[prevRowIndex]?.[colIndex]?.focus()
              }
            } else if (e.key === "ArrowLeft") {
              e.stopPropagation()
              // Move focus to the previous input to the left in the same row
              const prevColIndex = colIndex - 1
              if (prevColIndex >= 0) {
                refsMatrix.current[rowIndex]?.[prevColIndex]?.focus()
              }
            } else if (e.key === "ArrowRight") {
              e.stopPropagation()
              // Move focus to the next input to the right in the same row
              const nextColIndex = colIndex + 1
              if (refsMatrix.current[rowIndex]?.[nextColIndex]) {
                refsMatrix.current[rowIndex]?.[nextColIndex]?.focus()
              }
            } else if (e.key === "Escape") {
              // Blur the current input
              e.currentTarget.blur()
            }
          }}
        />
      )),
    ),
  )

  const handleSubmit = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault()
    console.log("handleSubmit")
    console.log(e)
  }

  return (
    <table
      className={cn(
        "w-full min-w-[1070px] table-fixed border-separate border-spacing-0 text-[14px]",
        className,
      )}
    >
      <tbody>
        {componentsMatrix.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
              <td key={colIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default MatrixTable
