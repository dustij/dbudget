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
          jan: 1000,
          feb: 1000,
          mar: 1000,
          apr: 1000,
          may: 1000,
          jun: 1000,
          jul: 1000,
          aug: 1000,
          sep: 1000,
          oct: 1000,
          nov: 1000,
          dec: 1000,
        },
        {
          id: 3,
          name: "Utilities",
          jan: 1000,
          feb: 1000,
          mar: 1000,
          apr: 1000,
          may: 1000,
          jun: 1000,
          jul: 1000,
          aug: 1000,
          sep: 1000,
          oct: 1000,
          nov: 1000,
          dec: 1000,
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
          jan: 1000,
          feb: 1000,
          mar: 1000,
          apr: 1000,
          may: 1000,
          jun: 1000,
          jul: 1000,
          aug: 1000,
          sep: 1000,
          oct: 1000,
          nov: 1000,
          dec: 1000,
        },
        {
          id: 3,
          name: "Utilities",
          jan: 1000,
          feb: 1000,
          mar: 1000,
          apr: 1000,
          may: 1000,
          jun: 1000,
          jul: 1000,
          aug: 1000,
          sep: 1000,
          oct: 1000,
          nov: 1000,
          dec: 1000,
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
