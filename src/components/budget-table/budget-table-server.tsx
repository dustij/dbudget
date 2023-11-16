import { type FC } from "react"
import BudgetTableClient from "./budget-table-client"
import { getServerAuthSession } from "~/app/api/auth/[...nextauth]/options"
import { amounts, amountsRelations, categories } from "~/db/schema"
import { db } from "~/db"
import { eq } from "drizzle-orm"

interface BudgetTableProps {
  className?: string
  userId: string
}

const BudgetTableServer: FC<BudgetTableProps> = async ({
  className,
  userId,
}) => {
  const getAmountsData = async (userId: string): Promise<AmountsModel[]> => {
    const result = await db
      .select()
      .from(amounts)
      .leftJoin(categories, eq(amounts.categoryId, categories.id))
      .where(eq(amounts.userId, userId))

    console.log(result)

    // Group the results by category
    const groupedResults = result.reduce(
      (acc, row) => {
        if (!row.category) return acc
        const categoryId = row.category.id

        if (!acc[categoryId]) {
          acc[categoryId] = {
            id: categoryId,
            name: row.category.name,
            parent: row.category.parent,
            monthlyAmounts: Array.from({ length: 12 }).fill(0) as number[],
          }
        }

        const monthIndex = parseInt(row.amount.month) - 1 //  Months are stored as 1-12, so we need to subtract 1 to get the correct index

        // Can assert here because we just created the category if it didn't exist
        acc[categoryId]!.monthlyAmounts[monthIndex] = parseFloat(
          row.amount.amount,
        )

        return acc
      },
      {} as {
        [categoryID: string]: {
          id: string
          name: string
          parent: CategoryParent
          monthlyAmounts: number[]
        }
      },
    )

    console.log(groupedResults)
    const parents: CategoryParent[] = [
      "income",
      "fixed",
      "variable",
      "discretionary",
      "obligation",
      "leakage",
      "savings",
    ]

    const formattedResults = parents.map((parent) => {
      const children = Object.values(groupedResults).filter(
        (category) => category.parent === parent,
      )

      return {
        parent: parent,
        categories: children.map((child) => ({
          id: child.id,
          name: child.name,
          monthlyAmounts: child.monthlyAmounts,
        })),
      }
    })

    console.log(formattedResults)

    return formattedResults
  }

  const data = await getAmountsData(userId)

  return <BudgetTableClient className={className} userId={userId} data={data} />
}

export default BudgetTableServer
