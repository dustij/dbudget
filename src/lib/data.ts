import { eq } from "drizzle-orm"
import { db } from "~/db"
import { amounts, categories } from "~/db/schema"

export async function getBudgetData(userId: string): Promise<IBudget> {
  try {
    const rawData = await db
      .select()
      .from(categories)
      .leftJoin(amounts, eq(amounts.categoryId, categories.id))
      .where(eq(categories.userId, userId))
      .orderBy(categories.createdAt)

    const reducedData = rawData.reduce(
      (acc, row) => {
        const { category, amount } = row

        // Add category id to array of categories if it doesn't exist
        if (!acc.categories.includes(category)) {
          acc.categories.push(category)
        }

        // If no amount then there is no data to add to the yearData object
        if (!amount) {
          return acc
        }

        // If year doesn't exist, create it
        if (!acc.yearData[amount.year]) {
          acc.yearData[amount.year] = {}
        }

        // If category doesn't exist, create it
        if (!acc.yearData[amount.year]![category.id]) {
          acc.yearData[amount.year]![category.id] = {
            ...category,
            monthlyAmounts: Array.from({ length: 12 }).fill(0) as number[],
          }
        }

        // Add amount to monthlyAmounts
        acc.yearData[amount.year]![category.id]!.monthlyAmounts[
          parseInt(amount.month) - 1
        ] = Number(amount.amount)

        return acc
      },
      { categories: [], yearData: {} } as {
        categories: ICategory[]
        yearData: {
          [year: string]: {
            [categoryId: string]: IExtendedCategory
          }
        }
      },
    )

    const formattedData = (() => {
      const yearData = Object.keys(reducedData.yearData).map((year) => {
        const amounts = Object.values(reducedData.yearData[year] ?? {}).reduce(
          (acc: any, category: any) => {
            const existingParent = acc.find(
              (item: any) => item.parent === category.parent,
            )
            if (existingParent) {
              existingParent.categories.push(category)
            } else {
              acc.push({
                parent: category.parent,
                categories: [category],
              })
            }
            return acc
          },
          [],
        )
        return {
          year: parseInt(year),
          amounts,
        }
      })
      return {
        categories: reducedData.categories,
        yearData,
      } as IBudget
    })()

    console.log(
      "Formatted data for user",
      userId,
      "\n⌄⌄⌄⌄⌄⌄⌄⌄⌄⌄\n",
      JSON.stringify(formattedData, null, 2),
      "\n",
    )

    return formattedData
  } catch (error) {
    console.error(error)
    throw new Error("Error getting budget data")
  }
}
