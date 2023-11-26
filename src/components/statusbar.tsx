"use client"

import { useState, FC, useEffect, useRef } from "react"
import { useLogContext } from "~/context/log-context"
import Clock from "./clock/clock"
import { cn } from "~/lib/utils"

interface StatusBarProps {
  onClick?: () => void
}

const getLastLogMessage = (log: Record<string, string> | null) => {
  const lastLog = Object.values(log || {}).slice(-1)[0] || null
  return lastLog ? lastLog.split("]")[1] : null
}

const StatusBar: FC<StatusBarProps> = ({ onClick }) => {
  const { log } = useLogContext()
  const [fadeOut, setFadeOut] = useState(false)
  const currentLogRef = useRef<string | null>(null)

  useEffect(() => {
    let fadeOutTimer: NodeJS.Timeout

    if (log) {
      const lastLogMessage = getLastLogMessage(log)

      // Check if the log message has changed
      if (lastLogMessage !== currentLogRef.current) {
        // If changed, reset fadeOut and update the currentLogRef
        setFadeOut(false)
        currentLogRef.current = lastLogMessage || null
      }

      // Set the fade-out effect after 5 seconds
      fadeOutTimer = setTimeout(() => {
        setFadeOut(true)
      }, 5000)
    }

    return () => {
      clearTimeout(fadeOutTimer)
    }
  }, [log])

  return (
    <div
      className="flex h-full items-center justify-between px-4 py-2 transition hover:cursor-pointer hover:bg-zinc-100"
      onClick={onClick}
    >
      <span
        className={cn(
          "flex-shrink truncate whitespace-nowrap text-base font-light transition mobile:text-sm",
          // if last log message begins with "Error", make it red
          getLastLogMessage(log)?.startsWith(" Error") && "text-red-500",
          getLastLogMessage(log)?.startsWith(" Success") && "text-lime-600",
          fadeOut && "opacity-0",
        )}
      >
        {log && getLastLogMessage(log)}
      </span>
      <Clock className="flex-grow whitespace-nowrap text-right text-base font-light mobile:text-sm" />
    </div>
  )
}

export default StatusBar

// FIXME: Error: Text content does not match server-rendered HTML.

// Warning: Text content did not match. Server: "Sun, Nov 26, 2023, 5:07 AM" Client: "Sun, Nov 26, 2023, 5:08 AM"

// See more info here: https://nextjs.org/docs/messages/react-hydration-error
