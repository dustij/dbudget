"use client"

import * as React from "react"

import { cn } from "~/lib/utils"
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"

interface FormInputProps {
  id: string
  placeholder?: string
  type: string
  autoCapitalize?: string
  autoComplete?: string
  autoCorrect?: string
  disabled?: boolean
  className?: string
  icon?: React.ReactNode
  register: UseFormRegister<FieldValues>
  validation?: {}
  errors?: FieldErrors<FieldValues>
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  placeholder,
  type,
  autoCapitalize,
  autoComplete,
  autoCorrect,
  disabled,
  className,
  icon,
  register,
  validation,
  errors,
}) => {
  const [showPassword, setShowPassword] = React.useState(false)

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="relative">
      {icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {icon}
        </div>
      )}
      <input
        id={id}
        placeholder={placeholder ?? ""}
        type={showPassword ? "text" : type}
        autoCapitalize={autoCapitalize ?? "none"}
        autoComplete={autoComplete ?? id}
        autoCorrect={autoCorrect ?? "off"}
        disabled={disabled ?? false}
        className={cn(
          "flex",
          "h-10",
          "w-full",
          "rounded-md",
          "border",
          "border-input",
          "bg-background",
          "px-3",
          "py-2",
          "text-sm",
          "ring-offset-background",
          "file:border-0",
          "file:bg-transparent",
          "file:text-sm",
          "file:font-medium",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-ring",
          "focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed",
          "disabled:opacity-50",
          className,
          errors && errors[id] ? "" : "",
          icon ? "pl-12" : "",
        )}
        {...register(id, validation)}
      />
      {type === "password" && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <input
            id="show-password"
            type="checkbox"
            checked={showPassword}
            onChange={toggleShowPassword}
            className={cn(
              className,
              "form-checkbox",
              "h-3",
              "w-3",
              "text-muted-foreground",
              "cursor-pointer",
            )}
          />
          <label
            htmlFor="show-password"
            className="text-muted-foreground ml-2 text-sm"
          >
            Show
          </label>
        </div>
      )}
    </div>
  )
}

export default FormInput
