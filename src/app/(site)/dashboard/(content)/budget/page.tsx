import type { FC } from "react"
import { getServerAuthSession } from "~/app/api/auth/[...nextauth]/options"
import BudgetTableServer from "~/components/budget-table/budget-table-server"

interface BudgetProps {}

const Budget: FC<BudgetProps> = async () => {
  const session = await getServerAuthSession()

  if (!session) {
    return null
  }

  return <BudgetTableServer userId={session.user.id} />
}

export default Budget
