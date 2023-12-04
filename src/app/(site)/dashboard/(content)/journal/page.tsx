import type { FC } from "react"
import { getServerAuthSession } from "~/app/api/auth/[...nextauth]/options"
import JournalServer from "~/components/journal/server"

interface JournalProps {}

const Journal: FC<JournalProps> = async () => {
  const session = await getServerAuthSession()

  if (!session) {
    return null
  }

  return <JournalServer userId={session.user.id} />
}

export default Journal
