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
        <DialogTrigger asChild>
          <div onClick={handleClick} style={{ cursor: "pointer" }}>
            {/* Content inside the trigger, like your StatusBar */}
            Click here to view logs
          </div>
        </DialogTrigger>
        <DialogContent className="h-fit max-h-[512px]">
          <DialogHeader>
            <DialogTitle>Logs</DialogTitle>
          </DialogHeader>
          <div className="h-full overflow-auto border p-2">
            {Object.entries(log).map(([timestamp, logItem]) => (
              <p
                key={timestamp}
                className={cn(
                  logItem.split("]")[1]?.startsWith(" Error") && "text-red-500",
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
