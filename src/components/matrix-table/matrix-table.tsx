"use client"

import { useState, type FC } from "react"
import { cn } from "~/lib/utils"
import { useMatrixRefs } from "./hooks"

interface MatrixTableProps {
  className?: string
}

const MatrixTable: FC<MatrixTableProps> = ({ className }) => {
  const refsMatrix = useMatrixRefs(10, 13)

  const [componentsMatrix, setComponentsMatrix] = useState(
    refsMatrix.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <input
          key={`${rowIndex}-${colIndex}`}
          className="w-full"
          ref={cell}
          onBlur={(e) => handleSubmit(e)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              // Move focus to the next input one row down in the same column
              const nextRowIndex = rowIndex + 1
              if (nextRowIndex < refsMatrix.length) {
                refsMatrix[nextRowIndex]![colIndex]!.current?.focus()
              }
            } else if (e.key === "Enter" && e.shiftKey) {
              // Move focus to the previous input one row up in the same column
              const prevRowIndex = rowIndex - 1
              if (prevRowIndex >= 0) {
                refsMatrix[prevRowIndex]![colIndex]!.current?.focus()
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
