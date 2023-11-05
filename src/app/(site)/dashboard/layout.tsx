"use client"

import { SessionProvider } from "next-auth/react"

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
