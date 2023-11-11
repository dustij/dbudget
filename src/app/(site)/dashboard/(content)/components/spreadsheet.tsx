"use client"

import React, { useState, type FC, useRef, useEffect } from "react"
import { Input } from "~/components/ui/input"
import { cn, formatCurrency } from "~/lib/utils"
import { IoAddCircleOutline } from "react-icons/io5"

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
  return <tbody className={cn(className)}>{children}</tbody>
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
  isNewRow?: boolean
  // onSubmit: (value: string | number | undefined) => void
}

export const SpreadsheetCell: FC<SpreadsheetCellProps> = ({
  children,
  className,
  inputType = "number",
  isNewRow = false,
  // onSubmit,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [value, setValue] = useState(children)
  const inputRef = useRef<HTMLInputElement>(null)
  // TODO: need a prop for the category so when submiting the amounts that data is sent to the server correctly

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
    // TODO: need to check if there is a valid category name associated with the amount
    // onSubmit(value)
    setIsEditing(false)
  }
  return (
    <td
      onClick={() => setIsEditing(true)}
      className={cn(
        "relative cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap border-b border-r bg-white px-1.5 py-0 text-left font-normal transition hover:bg-zinc-50",
        inputType === "number"
          ? "text-right font-light tabular-nums"
          : "text-left",
        isNewRow && "bg-amber-50 hover:bg-yellow-100 hover:bg-opacity-40",
        isNewRow &&
          inputType === "number" &&
          "cursor-default hover:cursor-default hover:bg-amber-50 hover:bg-opacity-100",
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
            isNewRow && "selection:bg-amber-100 focus:border-yellow-400 ",
            isEditing ? "block" : "hidden",
            isNewRow &&
              inputType === "number" &&
              "hidden cursor-default hover:cursor-default",
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

interface SpreadsheetSectionCellProps {
  children?: React.ReactNode
  className?: string
  onClick?: () => void
}

export const SpreadsheetSectionCell: FC<SpreadsheetSectionCellProps> = ({
  children,
  className,
  onClick,
}) => {
  return (
    <td
      className={cn(
        "relative cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r bg-white px-1.5 py-0 text-left font-normal hover:bg-zinc-50",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </td>
  )
}

interface SpreadsheetSectionProps {
  children?: React.ReactNode[]
  name: string
}

export const SpreadsheetSection: FC<SpreadsheetSectionProps> = ({
  children,
  name,
}) => {
  const [isNewRow, setIsNewRow] = useState(false)
  const [newCategory, setNewCategory] = useState("")

  const onAddRow = (name: string) => {
    setIsNewRow(true)
  }

  // const handleSubmitCategory = (value: string | number | undefined) => {
  // TODO: handle unique constraint when server actions are implemented
  // setNewCategory(value as string)
  // setIsNewRow(false)
  // }

  return (
    <>
      <SpreadsheetRow>
        <SpreadsheetSectionCell className="sticky left-0 z-10 font-semibold hover:bg-white ">
          {name}
        </SpreadsheetSectionCell>
        {Array.from({ length: 12 }, (_, i) => (
          <SpreadsheetSectionCell key={i} className="hover:bg-white" />
        ))}
      </SpreadsheetRow>
      {children}
      {isNewRow && (
        <SpreadsheetRow className="h-[22px] ">
          <SpreadsheetCell
            className="sticky left-0 z-10"
            isNewRow
            inputType="text"
            // onSubmit={handleSubmitCategory}
          >
            {undefined}
          </SpreadsheetCell>
          {Array.from({ length: 12 }, (_, i) => (
            <SpreadsheetCell
              isNewRow
              key={i}
              // onSubmit={() => {}}
            >
              {undefined}
            </SpreadsheetCell>
          ))}
        </SpreadsheetRow>
      )}
      <SpreadsheetRow>
        <SpreadsheetSectionCell
          className="sticky left-0 z-10 pl-3 text-zinc-400 transition hover:cursor-pointer hover:bg-zinc-50 hover:text-zinc-900"
          onClick={() => {
            onAddRow(name)
          }}
        >
          <IoAddCircleOutline className="mr-1 inline-block" />
          Add
        </SpreadsheetSectionCell>
        {Array.from({ length: 12 }, (_, i) => (
          <SpreadsheetSectionCell key={i} className="hover:bg-white" />
        ))}
      </SpreadsheetRow>
    </>
  )
}
