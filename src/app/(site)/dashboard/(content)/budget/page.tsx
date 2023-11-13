import type { FC } from "react"
import MatrixTable from "~/components/matrix-table/matrix-table"

import YearPicker from "~/components/year-picker"

interface BudgetProps {}

interface CategoryData {
  category: string
  jan?: number
  feb?: number
  mar?: number
  apr?: number
  may?: number
  jun?: number
  jul?: number
  aug?: number
  sep?: number
  oct?: number
  nov?: number
  dec?: number
}

interface BudgetData {
  [key: string]: CategoryData[]
}

const Budget: FC<BudgetProps> = () => {
  const sections = [
    "Fixed",
    "Variable",
    "Discretionary",
    "Obligations",
    "Leaks",
  ]

  const data: BudgetData = {
    fixed: [
      {
        category: "Rent",
        feb: 1800,
        mar: 1800,
        apr: 1800,
        may: 1800,
        jun: 1800,
        jul: 1800,
        aug: 1800,
        sep: 1800,
        oct: 1800,
        nov: 1800,
        dec: 1800,
      },
    ],
  }

  return (
    <>
      <div className="sticky left-0 top-0 z-20 flex h-[33px] items-center justify-center border-b bg-white">
        <YearPicker>{2021}</YearPicker>
      </div>
      <div className="relative">
        <MatrixTable></MatrixTable>
      </div>
    </>
  )
}

export default Budget
