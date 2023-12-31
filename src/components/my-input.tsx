"use client"

import React, { useState } from "react"
import { cn, formatCurrency } from "~/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string | number
  dollarSign?: boolean | undefined
  onFocusOut?: ({}: {
    e: React.FocusEvent<HTMLInputElement>
    setValue: React.Dispatch<React.SetStateAction<string | number>>
  }) => void
}

const MyInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, value, dollarSign = false, onFocusOut, ...props },
    ref,
  ) => {
    const [_value, setValue] = useState(
      type === "number" ? formatCurrency(value, false) : value,
    )

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (["Enter", "Escape"].includes(e.key)) {
        e.currentTarget.blur()
      }
      props.onKeyDown?.(e)
    }

    return (
      <input
        type={type}
        className={cn(
          "absolute left-0 top-0 h-full w-full cursor-default overflow-hidden text-ellipsis whitespace-nowrap rounded bg-transparent px-1.5 pl-2.5 text-left text-base text-zinc-900 [appearance:textfield] selection:bg-lime-200 hover:cursor-default focus-visible:bg-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-lime-500 mobile:text-sm",
          type === "number" && "text-right",
          className,
        )}
        ref={ref}
        value={_value}
        step={type === "number" ? "0.01" : undefined}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => {
          type === "number" &&
            setValue(formatCurrency(_value === "" ? 0 : _value, dollarSign))
          onFocusOut?.({
            e: e,
            setValue: setValue,
          })
        }}
        {...props}
        onKeyDown={handleKeyDown}
      />
    )
  },
)

MyInput.displayName = "Input"

export { MyInput }
