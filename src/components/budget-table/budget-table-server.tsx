import { type FC } from "react"
import { getBudgetData } from "~/lib/data"
import BudgetTableClient from "./budget-table-client"

interface BudgetTableServerProps {
  userId: string
}

const BudgetTableServer: FC<BudgetTableServerProps> = async ({ userId }) => {
  const data = await getBudgetData(userId)

  return <BudgetTableClient data={data} userId={userId} />
}

export default BudgetTableServer
