import type { FC } from "react"
import { getBudgetData } from "~/lib/data"
import { cn } from "~/lib/utils"
import BudgetTableClient from "./budget-table-client"

interface BudgetTableServerProps {
  className?: string
  userId: string
}

const BudgetTableServer: FC<BudgetTableServerProps> = ({
  className,
  userId,
}) => {
  const budget = getBudgetData(userId)
  return (
    <div className={cn(className)}>
      <BudgetTableClient budget={budget} />
    </div>
  )
}

export default BudgetTableServer
