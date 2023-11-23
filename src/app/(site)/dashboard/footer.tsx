"use client"

import type { FC } from "react"
import StatusBar from "~/components/statusbar"

interface FooterProps {}

const Footer: FC<FooterProps> = () => {
  const handleClick = () => {
    console.log("Footer clicked!")
  }
  return (
    <footer className="h-6 bg-yellow-500">
      <StatusBar onClick={handleClick} />
    </footer>
  )
}

export default Footer
