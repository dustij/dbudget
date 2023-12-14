import { FC } from "react"
import JournalClient from "./client"

interface JournalServerProps {
  userId: string
}

const JournalServer: FC<JournalServerProps> = async ({ userId }) => {
  const data = {
    categories: [
      {
        id: "59zphcwwo627",
        name: "Commission",
        userId: "f57d940d-2347-42ea-b155-e14495853e89",
        parent: "income",
        ruleId: null,
        createdAt: "2023-12-07T14:07:04.000Z",
        updatedAt: "2023-12-07T14:07:04.000Z",
      },
      {
        id: "alv3ovi5om44",
        name: "Hourly",
        userId: "f57d940d-2347-42ea-b155-e14495853e89",
        parent: "income",
        ruleId: null,
        createdAt: "2023-12-04T11:34:47.000Z",
        updatedAt: "2023-12-04T11:34:47.000Z",
      },
      {
        id: "2de188scw15x",
        name: "Rent",
        userId: "f57d940d-2347-42ea-b155-e14495853e89",
        parent: "fixed",
        ruleId: null,
        createdAt: "2023-12-04T11:34:47.000Z",
        updatedAt: "2023-12-04T11:34:47.000Z",
      },
      {
        id: "egh4quyucbr6",
        name: "Gas",
        userId: "f57d940d-2347-42ea-b155-e14495853e89",
        parent: "variable",
        ruleId: null,
        createdAt: "2023-12-04T11:50:43.000Z",
        updatedAt: "2023-12-04T11:50:43.000Z",
      },
      {
        id: "ee6m49dzdon5",
        name: "Groceries",
        userId: "f57d940d-2347-42ea-b155-e14495853e89",
        parent: "variable",
        ruleId: null,
        createdAt: "2023-12-04T11:50:43.000Z",
        updatedAt: "2023-12-04T11:50:43.000Z",
      },
    ],
    journalsByYear: [
      {
        year: 2023,
        journals: [
          {
            id: "1",
            date: "2023-01-01",
            categoryId: "59zphcwwo627",
            amount: 100000,
            notes: "Commission",
          },
          {
            id: "2",
            date: "2023-01-02",
            categoryId: "alv3ovi5om44",
            amount: 100000,
            notes: "Hourly",
          },
          {
            id: "3",
            date: "2023-01-03",
            categoryId: "2de188scw15x",
            amount: 100000,
            notes: "Rent",
          },
          {
            id: "4",
            date: "2023-01-04",
            categoryId: "egh4quyucbr6",
            amount: 100000,
            notes: "Gas",
          },
          {
            id: "5",
            date: "2023-01-05",
            categoryId: "ee6m49dzdon5",
            amount: 100000,
            notes: "Groceries",
          },
        ],
      },
    ],
  } as IJournalData

  const getServerJournals = async () => {
    "use server"
    return data
  }
  const setServerJournals = async (data: IJournalData) => {
    "use server"
    // filter out journals with null id only if they have 0 amount
    // data.journalsByYear.forEach((year) => {
    //   year.journals = year.journals.filter(
    //     (journal) => journal.id !== null || journal.amount !== 0,
    //   )
    // })
    return data
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
