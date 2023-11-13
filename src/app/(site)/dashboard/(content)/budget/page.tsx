import type { FC } from "react"
import BudgetTable from "~/components/matrix-table/budget-table/budget-table"
import {
  MatrixHeader,
  MatrixHeaderCell,
} from "~/components/matrix-table/matrix-header"

import YearPicker from "~/components/year-picker"

interface BudgetProps {}

const Budget: FC<BudgetProps> = () => {
  const sections = [
    "Fixed",
    "Variable",
    "Discretionary",
    "Obligations",
    "Leaks",
  ]

  return (
    <>
      <div className="sticky left-0 top-0 z-20 flex h-[33px] items-center justify-center border-b bg-white">
        <YearPicker>{2021}</YearPicker>
      </div>
      <div className="relative">
        <BudgetTable
          rows={9}
          headers={{
            names: [
              "Category",
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            node: (
              <MatrixHeader className="top-[33px]">
                <MatrixHeaderCell className="sticky left-0 bg-white text-left">
                  Category
                </MatrixHeaderCell>
                <MatrixHeaderCell>Jan</MatrixHeaderCell>
                <MatrixHeaderCell>Feb</MatrixHeaderCell>
                <MatrixHeaderCell>Mar</MatrixHeaderCell>
                <MatrixHeaderCell>Apr</MatrixHeaderCell>
                <MatrixHeaderCell>May</MatrixHeaderCell>
                <MatrixHeaderCell>Jun</MatrixHeaderCell>
                <MatrixHeaderCell>Jul</MatrixHeaderCell>
                <MatrixHeaderCell>Aug</MatrixHeaderCell>
                <MatrixHeaderCell>Sep</MatrixHeaderCell>
                <MatrixHeaderCell>Oct</MatrixHeaderCell>
                <MatrixHeaderCell>Nov</MatrixHeaderCell>
                <MatrixHeaderCell>Dec</MatrixHeaderCell>
              </MatrixHeader>
            ),
          }}
        />
      </div>
    </>
  )
}

export default Budget
