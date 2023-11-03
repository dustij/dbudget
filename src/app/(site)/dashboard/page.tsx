"use client"

import { useSession } from "next-auth/react"

const Dashboard = () => {
  const session = useSession()
  console.log(session)

  return <div>Dashboard</div>
}

export default Dashboard
