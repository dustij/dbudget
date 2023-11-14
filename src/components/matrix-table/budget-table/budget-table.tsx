import type { FC } from "react"
import { IoAddCircleOutline } from "react-icons/io5"
import MatrixTable, { MatrixTableProps } from "../matrix-table"
import { CategoryParent } from "../../../../temp/categories"
import BudgetTableClient from "./budget-table-client"

const BudgetTable: FC<MatrixTableProps> = ({
  className,
  // rows,
  // columns,
  // headers,
}) => {
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
