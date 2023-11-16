import type { FC } from "react"
import { getServerAuthSession } from "~/app/api/auth/[...nextauth]/options"
import BudgetTableServer from "~/components/budget-table/budget-table-server"
import YearPicker from "~/components/year-picker"

interface BudgetProps {}

const Budget: FC<BudgetProps> = async () => {
  const session = await getServerAuthSession()

  if (!session) {
    return null
  }

  return (
    <>
      <div className="sticky left-0 top-0 z-30 flex h-[33px] items-center justify-center border-b bg-white">
        <YearPicker>{2021}</YearPicker>
      </div>
      <div className="relative">
        <BudgetTableServer userId={session.user.id} />
      </div>
    </>
  )
}

export default Budget
