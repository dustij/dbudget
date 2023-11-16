import { type FC } from "react"
import BudgetTableClient from "./budget-table-client"
import { retrieveBudget } from "~/lib/actions"
import { getServerAuthSession } from "~/app/api/auth/[...nextauth]/options"

interface BudgetTableProps {
  className?: string
}

const BudgetTableServer: FC<BudgetTableProps> = async ({ className }) => {
  const session = await getServerAuthSession()

  if (!session) {
    return null
  }

  const budgetData: AmountsModel[] = await retrieveBudget(session.user.id, 2023)
  budgetData.forEach((item) => {
    console.log(item)
  })
  return (
    <BudgetTableClient
      className={className}
      data={budgetData}
      userId={session.user.id}
    />
  )
}

export default BudgetTableServer
