"use client"

import type { FC } from "react"
import { useEffect, useState } from "react"
import { cn } from "~/lib/utils"

interface ClockProps {
  initialTime: Date
  className?: string
}

const Clock: FC<ClockProps> = ({ className, initialTime }) => {
  const [time, setTime] = useState(() => new Date(initialTime))

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span className={cn("text-zinc-500", className)}>
      {time.toLocaleTimeString([], {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })}
    </span>
  )
}

export default Clock
