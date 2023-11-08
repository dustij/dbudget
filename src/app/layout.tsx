import "./globals.css"

import type { Metadata } from "next"
import { GeistSans } from "geist/font"

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
      <body className={GeistSans.className}>{children}</body>
    </html>
  )
}
