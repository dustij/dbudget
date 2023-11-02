import { forwardRef } from "react"
import { twMerge } from "tailwind-merge"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, disabled, type = "button", ...props }, ref) => {
    return (
      <button
        type={type}
        className={twMerge("rounded-full px-5 py-3 text-zinc-900", className)}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = "Button"

export default Button
