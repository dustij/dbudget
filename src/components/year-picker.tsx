"use client"

import { useState, type FC, useRef, useEffect } from "react"
import { cn } from "~/lib/utils"

interface YearPickerProps {
  children: number
}

const YearPicker: FC<YearPickerProps> = ({ children }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [value, setValue] = useState(children)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      if (isEditing) {
        inputRef.current.focus()
        inputRef.current.select()
      } else {
        inputRef.current.blur()
      }
    }
  }, [isEditing])

  const cancelEditing = () => {
    setIsEditing(false)
    setValue(children)
  }

  const submitEditing = () => {
    setIsEditing(false)
  }

  const increment = () => {
    setValue(value + 1)
    submitEditing()
  }

  const decrement = () => {
    setValue(value - 1)
    submitEditing()
  }

  return (
    <div className="flex flex-row items-center justify-center">
      <div className="flex flex-row items-center justify-center">
        <button
          className={cn(
            "flex h-8 w-8 flex-row items-center justify-center border-x bg-white text-sm font-medium text-zinc-400 transition hover:bg-zinc-50 hover:text-zinc-900",
            isMouseDown && "hover:bg-opacity-70 hover:text-opacity-70",
          )}
          type="button"
          onClick={() => decrement()}
          onMouseDown={() => setIsMouseDown(true)}
          onMouseUp={() => setIsMouseDown(false)}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <input
          ref={inputRef}
          className="h-8 w-16 rounded bg-white text-center text-base font-medium text-zinc-900 selection:bg-lime-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-lime-500"
          type="number"
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === "Enter") submitEditing()
            if (e.key === "Escape") cancelEditing()
          }}
          onBlur={() => cancelEditing()}
          onFocus={() => setIsEditing(true)}
        />
        <button
          className={cn(
            "flex h-8 w-8 flex-row items-center justify-center border-x bg-white text-sm font-medium text-zinc-400 transition hover:bg-zinc-50 hover:text-zinc-900",
            isMouseDown && "hover:bg-opacity-70 hover:text-opacity-70",
          )}
          type="button"
          onClick={() => increment()}
          onMouseDown={() => setIsMouseDown(true)}
          onMouseUp={() => setIsMouseDown(false)}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default YearPicker
