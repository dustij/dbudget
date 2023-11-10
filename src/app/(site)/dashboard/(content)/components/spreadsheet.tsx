"use client"

import React, { useState, type FC, useRef, useEffect } from "react"
import { Input } from "~/components/ui/input"
import { cn, formatCurrency } from "~/lib/utils"

interface SpreadsheetProps {
  children: React.ReactNode
  className?: string
}

export const Spreadsheet: FC<SpreadsheetProps> = ({ children, className }) => {
  return (
    <table
      className={cn(
        "w-full min-w-[1070px] table-fixed border-separate border-spacing-0 text-[14px]",
        className,
      )}
    >
      {children}
    </table>
  )
}

interface SpreadsheetHeaderProps {
  children: React.ReactNode
  className?: string
}

export const SpreadsheetHeader: FC<SpreadsheetHeaderProps> = ({
  children,
  className,
}) => {
  return (
    <thead className={cn("sticky top-0 z-30 h-[33px] bg-white", className)}>
      {children}
    </thead>
  )
}

interface SpreadsheetBodyProps {
  children: React.ReactNode
  className?: string
}

export const SpreadsheetBody: FC<SpreadsheetBodyProps> = ({
  children,
  className,
}) => {
  const [activeCell, setActiveCell] = useState<null | {
    row: number
    col: number
  }>(null)
  const rows = useRef<React.ReactNode[]>([])

  useEffect(() => {
    rows.current.forEach((row, rowIndex) => {
      if (React.isValidElement(row)) {
        React.Children.forEach(
          row.props.children,
          (cell: React.ReactElement<SpreadsheetCellProps>, colIndex) => {
            if (React.isValidElement(cell)) {
              cell.props.loc = { row: rowIndex, col: colIndex }
              cell.props.setActiveCell = setActiveCell
            }
          },
        )
      }
    })
  }, [])

  useEffect(() => {
    console.log("Active cell", activeCell)
  }, [activeCell])

  return (
    <tbody className={cn(className)}>
      {React.Children.map(children, (child, rowIndex) => {
        rows.current[rowIndex] = child
        return child
      })}
    </tbody>
  )
}

interface SpreadsheetRowProps {
  children: React.ReactNode
  className?: string
}

export const SpreadsheetRow: FC<SpreadsheetRowProps> = ({
  children,
  className,
}) => {
  return <tr className={cn(className)}>{children}</tr>
}

interface SpreadsheetCellProps {
  children: string | number | undefined
  className?: string
  inputType?: "text" | "number"
  loc?: { row: number; col: number }
  setActiveCell?: React.Dispatch<{ row: number; col: number }>
}

export const SpreadsheetCell: FC<SpreadsheetCellProps> = ({
  children,
  className,
  inputType = "number",
  loc,
  setActiveCell,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [value, setValue] = useState(children)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
      console.log("Broadcasting", loc)
      setActiveCell?.(loc!)
    }
  }, [isEditing])

  const cancelEditing = () => {
    setIsEditing(false)
    setValue(children)
  }

  const submitEditing = () => {
    setIsEditing(false)
  }
  return (
    <td
      onClick={() => setIsEditing(true)}
      className={cn(
        "relative cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap border-b border-r bg-white px-1.5 py-0 text-left font-normal hover:bg-zinc-50",
        inputType === "number"
          ? "text-right font-light tabular-nums"
          : "text-left",
        className,
      )}
    >
      {inputType === "number" ? formatCurrency(value, false) : value}
      {isClient && (
        <Input
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Escape") cancelEditing()
            if (e.key === "Enter") submitEditing()
          }}
          className={cn(
            "absolute left-0 top-0 h-full w-full rounded-lg px-1 selection:bg-lime-100 focus:border-lime-500 focus-visible:ring-0 focus-visible:ring-offset-0",
            inputType === "number" ? "text-right tabular-nums" : "text-left",
            isEditing ? "block" : "hidden",
          )}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type={inputType}
          onBlur={() => cancelEditing()}
          step={"0.01"}
        />
      )}
    </td>
  )
}

interface SpreadsheetHeaderCellProps {
  children: React.ReactNode
  className?: string
}

export const SpreadsheetHeaderCell: FC<SpreadsheetHeaderCellProps> = ({
  children,
  className,
}) => {
  return (
    <th
      className={cn(
        "cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r px-1.5 text-right text-base font-normal text-zinc-400",
        className,
      )}
    >
      {children}
    </th>
  )
}
