"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"
// import { selectAllUsers, insertUser } from "~/lib/actions"

const Dashboard = () => {
  const { data: session, status } = useSession()

  // useEffect(() => {
  //   if (
  //     status === "loading" ||
  //     status === "unauthenticated" ||
  //     !session ||
  //     !session.user
  //   ) {
  //     return
  //   }

  //   if (!session.user.email) {
  //     throw new Error("No email found")
  //   }

  //   const result = insertUser({
  //     email: session.user.email,
  //     name: session.user.name,
  //     image: session.user.image,
  //   })

  //   console.log(session)
  // }, [session])

  // useEffect(() => {
  //   const results = selectAllUsers()
  //   results.then((res) => {
  //     console.log(res)
  //   })
  // }, [session])

  return <div>Dashboard</div>
}

export default Dashboard
