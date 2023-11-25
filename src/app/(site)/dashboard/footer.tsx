"use client"

import { useState, type FC } from "react"
import StatusBar from "~/components/statusbar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { useLogContext } from "~/context/log-context"
import { cn } from "~/lib/utils"

interface FooterProps {}

const Footer: FC<FooterProps> = () => {
  const [showDialog, setShowDialog] = useState(false)
  const { log } = useLogContext()

  const handleClick = () => {
    setShowDialog(true)
  }

  const handleClose = () => {
    setShowDialog(false)
  }

  return (
    <>
      <footer className="h-6 border-b border-l border-r bg-white">
        <StatusBar onClick={handleClick} />
      </footer>
      <Dialog open={showDialog} onOpenChange={handleClose}>
        <DialogContent className="flex max-h-full flex-col mobile-hz:h-[512px]">
          <DialogHeader className="">
            <DialogTitle>Logs</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-auto border p-2">
            {Object.entries(log).map(([timestamp, logItem]) => (
              <p
                key={timestamp}
                className={cn(
                  "font-light",
                  logItem.split("]")[1]?.startsWith(" Error") && "text-red-500",
                  logItem.split("]")[1]?.startsWith(" Success") &&
                    "text-lime-600",
                )}
              >
                {logItem}
              </p>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Footer
