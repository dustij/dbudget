import type { FC } from "react"
import { getServerAuthSession } from "~/app/api/auth/[...nextauth]/options"
import BudgetServer from "~/components/budget/server"

interface BudgetProps {}

const Budget: FC<BudgetProps> = async () => {
  const session = await getServerAuthSession()

  if (!session) {
    return null
  }

  return <BudgetServer userId={session.user.id} />
}

export default Budget
