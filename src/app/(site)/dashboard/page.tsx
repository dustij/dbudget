import type { NextPage } from "next"
import { getServerAuthSession } from "~/app/api/auth/[...nextauth]/options"
import Main from "./components/main"
import Header from "./components/header"

const Dashboard: NextPage = async () => {
  const session = await getServerAuthSession()
  // console.debug(JSON.stringify(session, null, 2))

  if (!session) {
    return null
  }

  return (
    <div>
      <Header user={session.user} />
      <Main />
    </div>
  )
}

export default Dashboard
