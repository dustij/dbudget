import type { FC } from "react"
import { CategoryParent } from "../../../../temp/categories"
import BudgetTableClient from "./budget-table-client"

interface BudgetTableProps {
  className?: string
}

const BudgetTable: FC<BudgetTableProps> = ({ className }) => {
  const handleSubmit = (data: {
    row: (HTMLInputElement | null)[] | undefined
    header: string | undefined
    value: string
  }) => {
    console.log(data)
  }

  // TODO: query data
  const mockData: CategoryParent[] = [
    {
      id: 1,
      name: "Fixed",
      categories: [
        {
          id: 2,
          name: "Rent",
          monthlyAmounts: [
            1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,
            1000,
          ],
        },
        {
          id: 3,
          name: "Utilities",
          monthlyAmounts: [
            1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,
            1000,
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Variable",
      categories: [
        {
          id: 2,
          name: "Rent",
          monthlyAmounts: [
            1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,
            1000,
          ],
        },
        {
          id: 3,
          name: "Utilities",
          monthlyAmounts: [
            1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,
            1000,
          ],
        },
      ],
    },
  ]

  return (
    <BudgetTableClient
      className={className}
      data={mockData}
    ></BudgetTableClient>
  )
}

export default BudgetTable
