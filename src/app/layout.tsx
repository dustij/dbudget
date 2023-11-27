import "./globals.css"

import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font"
import { LogProvider } from "~/context/log-context"

export const metadata: Metadata = {
  title: "Dbudget",
  description: "Budgeting for the rest of us",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <LogProvider>
        <body className={GeistSans.className}>{children}</body>
        <Analytics />
      </LogProvider>
    </html>
  )
}
