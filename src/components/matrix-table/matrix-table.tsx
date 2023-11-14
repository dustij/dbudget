"use client"

import { useState, type FC, FocusEvent, isValidElement } from "react"
import { cn } from "~/lib/utils"
import { useRefsMatrix } from "./hooks"

export interface MatrixTableProps {
  className?: string
  children?: React.ReactNode
  rows: number // TODO: this should be optional, and if not provided, it should be inferred from children
  columns?: number
  headers?: {
    names: string[]
    node: React.ReactNode
  } | null
  onSubmit?: (data: {
    row: (HTMLInputElement | null)[] | undefined
    header: string | undefined
    value: string
  }) => void
}

const MatrixTable: FC<MatrixTableProps> = ({
  className,
  children,
  rows,
  columns,
  headers,
  onSubmit,
}) => {
  if (isValidElement(headers?.node) && headers?.node?.type === "thead") {
    if (headers.node.props.children?.type === "tr") {
      // set columns to the number of children of the tr element
      columns = headers.node.props.children.props.children.length
    } else {
      // headers.node does not have a tr element as a child
      throw new Error(
        "MatrixTable: headers.node must be a thead element with tr children",
      )
    }
  } else {
    // columns must be provided if headers was not, in order to build matrix
    if (columns === undefined) {
      throw new Error(
        "MatrixTable: columns must be provided if headers was not provided",
      )
    }
  }

  // TODO: rows should be optional, and if not provided, it should be inferred from children
  const refsMatrix = useRefsMatrix(rows, columns!)

  const [componentsMatrix, setComponentsMatrix] = useState(
    refsMatrix.current.map((row, rowIndex) =>
      row.map((_, colIndex) => (
        <input
          key={`${rowIndex}-${colIndex}`}
          className="w-full"
          ref={(input) => {
            // https://react.dev/reference/react-dom/components/common#ref-callback
            refsMatrix.current[rowIndex]![colIndex] = input
          }}
          onBlur={(e) => handleSubmit(e, [rowIndex, colIndex])}
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

  const handleSubmit = (
    e: FocusEvent<HTMLInputElement, Element>,
    loc: [number, number],
  ) => {
    e.preventDefault()

    const row = refsMatrix.current[loc[0]]
    const header = headers?.names[loc[1]]
    const value = e.currentTarget.value

    onSubmit?.({ row, header, value })
  }

  return (
    <form>
      <table
        className={cn(
          "w-full min-w-[1070px] table-fixed border-separate border-spacing-0 text-[14px]",
          className,
        )}
      >
        {headers && headers.node}
        <tbody>
          {children}
          {/* {componentsMatrix.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>{cell}</td>
              ))}
            </tr>
          ))} */}
        </tbody>
      </table>
    </form>
  )
}

export default MatrixTable
