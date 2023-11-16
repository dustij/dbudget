import type { FC } from "react"
import BudgetTableClient from "./budget-table-client"
import { retrieveBudget } from "~/lib/actions"

interface BudgetTableProps {
  className?: string
}

const BudgetTableServer: FC<BudgetTableProps> = async ({ className }) => {
  // const handleSubmit = (data: {
  //   row: (HTMLInputElement | null)[] | undefined
  //   header: string | undefined
  //   value: string
  // }) => {
  //   console.log(data)
  // }

  // TODO: query data
  // const mockData: AmountsModel[] = [
  //   {
  //     parent: "Fixed",
  //     categories: [
  //       {
  //         id: 2,
  //         name: "Rent",
  //         monthlyAmounts: [
  //           1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,
  //           1000,
  //         ],
  //       },
  //       {
  //         id: 3,
  //         name: "Utilities",
  //         monthlyAmounts: [
  //           1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,
  //           1000,
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     parent: "Variable",
  //     categories: [
  //       {
  //         id: 2,
  //         name: "Rent",
  //         monthlyAmounts: [
  //           1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,
  //           1000,
  //         ],
  //       },
  //       {
  //         id: 3,
  //         name: "Utilities",
  //         monthlyAmounts: [
  //           1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,
  //           1000,
  //         ],
  //       },
  //     ],
  //   },
  // ]

  const budgetData: AmountsModel[] = await retrieveBudget(2023)

  return <BudgetTableClient className={className} data={budgetData} />
}

export default BudgetTableServer
