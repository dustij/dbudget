"use client"

import React, { FC, useEffect, useRef, useState } from "react"
import { Input } from "~/components/ui/input"
import { cn, formatCurrency } from "~/lib/utils"

interface TProps {
  children: string | number | undefined
  className?: string
}

interface TDProps extends TProps {
  inputType: "text" | "number"
}

interface TBodyProps {
  children: React.ReactElement
  className?: string
}

export const TBody: FC<TBodyProps> = ({ children, className }) => {
  const [activeCell, setActiveCell] = useState({ row: 0, col: 0 })
  const rows = useRef<React.ReactElement[]>([])

  useEffect(() => {
    if (rows.current.length > 0) {
      console.log(rows.current)
      console.log(activeCell)
      // console.log(rows.current[activeCell.row].cells[activeCell.col])
      // rows.current[activeCell.row].cells[activeCell.col]
    }
  }, [activeCell])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTableSectionElement>) => {
    if (e.key === "Enter") {
      // setActiveCell((prev) => ({ row: prev.row + 1, col: prev.col }))
    } else if (e.key === "Tab") {
      e.preventDefault()
      setActiveCell((prev) => ({ row: prev.row, col: prev.col + 1 }))
    }
  }

  const findActiveCell = (e: React.MouseEvent<HTMLTableSectionElement>) => {
    rows.current.forEach((row, rowIndex) => {
      row.props.children.forEach(
        (cell: React.ReactElement, colIndex: number) => {
          if (cell) {
            console.log("isEditing")
          }
          console.log(cell, "[", rowIndex, ",", colIndex, "]")
        },
      )
    })
    // React.Children.forEach(row, (cell, colIndex) => {
    //   console.log(cell)
    // if (cell === e.target) {
    //   setActiveCell({ row: rowIndex, col: colIndex })
    // }
    // })
  }

  return (
    <>
      <tbody
        className={cn(className)}
        onKeyDown={handleKeyDown}
        onClick={findActiveCell}
      >
        {React.Children.map(children, (child, rowIndex) => {
          rows.current[rowIndex] = child
          return child
        })}
      </tbody>
    </>
  )
}

export const Th: FC<TProps> = ({ children, className }) => (
  <>
    <th
      className={cn(
        "cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r px-1.5 text-right text-base font-normal text-zinc-400",
        className,
      )}
    >
      {children}
    </th>
  </>
)

export const Td: FC<TDProps> = ({ children, className, inputType }) => {
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
    <>
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
    </>
  )
}
