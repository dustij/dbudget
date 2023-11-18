import type { FC } from "react"
import { getBudgetData } from "~/lib/data"
import { cn } from "~/lib/utils"

interface BudgetTableServerProps {
  className?: string
  userId: string
}

const BudgetTableServer: FC<BudgetTableServerProps> = ({
  className,
  userId,
}) => {
  const budget = getBudgetData(userId)
  return <div className={cn(className)}>BudgetTable2</div>
}

export default BudgetTableServer
