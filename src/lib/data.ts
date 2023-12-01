import { eq } from "drizzle-orm"
import { db } from "~/db"
import { amounts, categories } from "~/db/schema"
import { saveJSONfile } from "./actions"

export async function getBudgetData(userId: string): Promise<IBudgetData> {
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
        if (!acc.categories.find((c) => c.id === category.id)) {
          acc.categories.push(category)
        }

        // If no amount then there is no data to add to the budgetsByYear object
        if (!amount) {
          return acc
        }

        // If year doesn't exist, create it
        if (!acc.budgetsByYear[amount.year]) {
          acc.budgetsByYear[amount.year] = {}
        }

        // If category doesn't exist, create it
        if (!acc.budgetsByYear[amount.year]![category.id]) {
          acc.budgetsByYear[amount.year]![category.id] = {
            ...category,
            monthlyAmounts: Array.from({ length: 12 }).fill({
              id: null,
              amount: 0,
            }) as IMonthlyAmount[],
          }
        }

        // Add amount to monthlyAmounts
        acc.budgetsByYear[amount.year]![category.id]!.monthlyAmounts[
          amount.month - 1
        ] = { id: amount.id, amount: Number(amount.amount) }

        return acc
      },
      { categories: [], budgetsByYear: {} } as {
        categories: ICategory[]
        budgetsByYear: {
          [year: string]: {
            [categoryId: string]: ICategoryBudget
          }
        }
      },
    )

    const formattedData = (() => {
      const budgetsByYear = Object.keys(reducedData.budgetsByYear).map(
        (year) => {
          const budgetsByParent = Object.values(
            reducedData.budgetsByYear[year] ?? {},
          ).reduce((acc: any, category: any) => {
            const existingParent = acc.find(
              (item: any) => item.parent === category.parent,
            )
            if (existingParent) {
              existingParent.budgetsByCategory.push(category)
            } else {
              acc.push({
                parent: category.parent,
                budgetsByCategory: [category],
              })
            }
            return acc
          }, [])
          return {
            year: parseInt(year),
            budgetsByParent,
          }
        },
      )
      return {
        categories: reducedData.categories,
        budgetsByYear,
      }
    })()

    // console.log("formattedData >", JSON.stringify(formattedData, null, 2))
    saveJSONfile("temp/.debug.data.json", formattedData)

    return formattedData
  } catch (error) {
    console.error(error)
    return { categories: [], budgetsByYear: [] }
  }
}
