import { NextPage } from "next"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { getServerAuthSession } from "~/app/api/auth/[...nextauth]/options"
// import { selectAllUsers, insertUser } from "~/lib/actions"

const Dashboard: NextPage = async () => {
  const user = await getServerAuthSession()

  console.debug("user")

  console.debug(JSON.stringify({ user }, null, 2))

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
