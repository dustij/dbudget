import type { FC } from "react"
import BudgetTableServer from "~/components/budget-table/budget-table-server"
import YearPicker from "~/components/year-picker"

interface BudgetProps {}

const Budget: FC<BudgetProps> = () => {
  return (
    <>
      <div className="sticky left-0 top-0 z-30 flex h-[33px] items-center justify-center border-b bg-white">
        <YearPicker>{2021}</YearPicker>
      </div>
      <div className="relative">
        <BudgetTableServer />
      </div>
    </>
  )
}

export default Budget
