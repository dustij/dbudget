import { FC } from "react"
import JournalClient from "./client"

interface JournalServerProps {
  userId: string
}

const JournalServer: FC<JournalServerProps> = async ({ userId }) => {
  const data = {}

  const getServerJournals = async () => {
    "use server"
    return {}
  }
  const setServerJournals = async (data: IJournalData) => {
    "use server"
    return {}
  }

  return (
    <JournalClient
      userId={userId}
      data={data}
      action={{ getServerJournals, setServerJournals }}
    />
  )
}

export default JournalServer
