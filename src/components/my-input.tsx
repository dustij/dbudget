"use client"

import React, { useState } from "react"
import { cn, formatCurrency } from "~/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  myValue: string | number
  dollarSign?: boolean | undefined
  onFocusOut?: ({}: {
    e: React.FocusEvent<HTMLInputElement>
    setValue: React.Dispatch<React.SetStateAction<string | number>>
  }) => void
}

const MyInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, myValue, dollarSign = false, onFocusOut, ...props },
    ref,
  ) => {
    const [value, setValue] = useState(
      type === "number" ? formatCurrency(myValue, false) : myValue,
    )

    return (
      <input
        type={type}
        className={cn(
          "absolute left-0 top-0 h-full w-full cursor-default overflow-hidden text-ellipsis whitespace-nowrap rounded bg-transparent px-1.5 pl-2.5 text-left text-base text-zinc-900 [appearance:textfield] selection:bg-lime-200 hover:cursor-default focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-lime-500 mobile:text-sm",
          type === "number" && "text-right",
          className,
        )}
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => {
          type === "number" &&
            setValue(formatCurrency(value === "" ? 0 : value, dollarSign))
          onFocusOut?.({
            e: e,
            setValue: setValue,
          })
        }}
        {...props}
      />
    )
  },
)

MyInput.displayName = "Input"

export { MyInput }
