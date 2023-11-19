import type { FC } from "react"
import { getBudgetData } from "~/lib/data"
import { cn } from "~/lib/utils"
import BudgetTableClient from "./budget-table-client"

interface BudgetTableServerProps {
  userId: string
}

const BudgetTableServer: FC<BudgetTableServerProps> = ({ userId }) => {
  const budget = getBudgetData(userId)
  return <BudgetTableClient budget={budget} />
}

export default BudgetTableServer
