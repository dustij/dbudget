import { type FC } from "react"
import { getBudgetData } from "~/lib/data"
import BudgetTableClient from "./budget-table-client"

interface BudgetTableServerProps {
  userId: string
}

const BudgetTableServer: FC<BudgetTableServerProps> = async ({ userId }) => {
  const budget = await getBudgetData(userId)

  return <BudgetTableClient userId={userId} />
}

export default BudgetTableServer
