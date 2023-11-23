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

interface FooterProps {}

const Footer: FC<FooterProps> = () => {
  const [showDialog, setShowDialog] = useState(false)

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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logs</DialogTitle>
          </DialogHeader>
          {/* Add your log content here */}
          {/* For example, you can map over your logs and display them */}
          {/* {logs.map(log => <div key={log.id}>{log.message}</div>)} */}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Footer
