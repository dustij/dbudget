"use client"

import { useState, type FC } from "react"
import StatusBar from "~/components/statusbar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { useLogContext } from "~/context/log-context"
import { cn } from "~/lib/utils"

interface FooterProps {
  initialTime: Date
}

const Footer: FC<FooterProps> = ({ initialTime }) => {
  const [showDialog, setShowDialog] = useState(false)
  const { log, clearLog } = useLogContext()

  const handleClick = () => {
    setShowDialog(true)
  }

  const handleClose = () => {
    setShowDialog(false)
  }

  return (
    <>
      <footer className="h-6 border-b border-l border-r bg-white">
        <StatusBar initialTime={initialTime} onClick={handleClick} />
      </footer>
      <Dialog open={showDialog} onOpenChange={handleClose}>
        <DialogContent className="flex max-h-full flex-col mobile-hz:h-[512px]">
          <DialogHeader className="">
            <DialogTitle>Logs</DialogTitle>
          </DialogHeader>
          <ul className="flex-grow overflow-auto border p-2">
            {Object.entries(log).map(([timestamp, logItem]) => (
              <li
                key={timestamp}
                className={cn(
                  "font-light",
                  logItem.split("]")[1]?.startsWith(" Error") && "text-red-500",
                  logItem.split("]")[1]?.startsWith(" Success") &&
                    "text-lime-600",
                )}
              >
                {logItem}
              </li>
            ))}
          </ul>
          <div className="flex justify-end">
            {/* clear logs button */}
            <button
              className="px-4 text-sm font-normal text-zinc-900 transition hover:opacity-70 focus-visible:outline-none focus-visible:ring-0"
              onClick={clearLog}
            >
              Clear
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Footer
