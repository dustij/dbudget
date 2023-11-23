import type { FC } from "react"
import { useTime } from "./hook"
import { cn } from "~/lib/utils"

interface ClockProps {
  className?: string
}

const Clock: FC<ClockProps> = ({ className }) => {
  const time = useTime()
  return (
    <span className={cn("text-zinc-500", className)}>
      {time.toLocaleTimeString([], {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}
    </span>
  )
}

export default Clock
