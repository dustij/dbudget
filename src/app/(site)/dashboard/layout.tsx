"use client"

import { SessionProvider } from "next-auth/react"
import React from "react"

interface DashboardProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardProps> = ({ children }) => {
  return (
    <SessionProvider>
      <div>{children}</div>
    </SessionProvider>
  )
}

export default DashboardLayout
