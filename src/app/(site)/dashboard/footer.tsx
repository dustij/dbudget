"use client"

import type { FC } from "react"
import StatusBar from "~/components/statusbar"

interface FooterProps {}

const Footer: FC<FooterProps> = () => {
  const handleClick = () => {
    console.log("Footer clicked!")
  }
  return (
    <footer className="h-6 border-b border-l border-r bg-white">
      <StatusBar onClick={handleClick} />
    </footer>
  )
}

export default Footer
