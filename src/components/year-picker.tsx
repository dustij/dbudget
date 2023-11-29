"use client"

import { useState, type FC, useRef, useEffect, useCallback } from "react"
import { cn } from "~/lib/utils"
import { Button } from "./ui/button"

interface YearPickerProps {
  children: number
  onYearChange: (year: number) => void
}

const YearPicker: FC<YearPickerProps> = ({ children, onYearChange }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(children)
  const [isFirstFocus, setIsFirstFocus] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      if (isEditing) {
        inputRef.current.focus()
        if (isFirstFocus) {
          inputRef.current.select()
          setIsFirstFocus(false)
        }
      } else {
        inputRef.current.blur()
        setIsFirstFocus(true)
        onYearChange(value)
      }
    }
  }, [isEditing, isFirstFocus, onYearChange, value])

  const submitEditing = () => {
    if (value.toString().length !== 4) {
      inputRef.current?.select()
      return
    }
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
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        className="h-8 p-1 text-zinc-500 hover:text-zinc-900 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime-500"
        type="button"
        onClick={() => decrement()}
      >
        <svg
          className="h-4 w-6"
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
      </Button>
      <input
        id="year-picker"
        ref={inputRef}
        className="h-8 w-20 cursor-default rounded border border-input bg-white text-center text-base text-zinc-900 selection:bg-lime-200 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        type="number"
        value={value}
        onChange={(e) => {
          setValue(parseInt(e.target.value))
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") submitEditing()
          if (e.key === "Escape") submitEditing()
        }}
        onBlur={() => submitEditing()}
        onFocus={() => setIsEditing(true)}
      />
      <Button
        variant="ghost"
        className="h-8 p-1 text-zinc-500 hover:text-zinc-900 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime-500"
        onClick={() => increment()}
      >
        <svg
          className="h-4 w-6"
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
      </Button>
    </div>
  )
}

export default YearPicker
