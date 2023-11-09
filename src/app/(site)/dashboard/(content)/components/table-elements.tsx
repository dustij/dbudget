"use client"

import { FC, useEffect, useRef, useState } from "react"
import { Input } from "~/components/ui/input"
import { cn } from "~/lib/utils"

interface TProps {
  children: string | number | readonly string[] | undefined
  className?: string
}

interface TDProps extends TProps {
  inputType: "text" | "number"
}

export const Th: FC<TProps> = ({ children, className }) => (
  <>
    <th
      className={cn(
        "overflow-hidden text-ellipsis whitespace-nowrap border-b border-r px-1.5 text-right font-semibold text-zinc-400",
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

  return (
    <>
      <td
        onClick={() => setIsEditing(true)}
        className={cn(
          "relative cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap border-b border-r px-1.5 py-0 text-right font-normal hover:bg-zinc-50",
          className,
        )}
      >
        {children}
        {isClient && (
          <Input
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                cancelEditing()
              }
            }}
            className={cn(
              "absolute left-0 top-0 h-full w-full px-1 selection:bg-lime-100 focus:border-lime-500",
              inputType === "number" ? "text-right" : "text-left",
              isEditing ? "block" : "hidden",
            )}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type={inputType}
            onBlur={() => cancelEditing()}
          />
        )}
      </td>
    </>
  )
}
