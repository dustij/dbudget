import { eq } from "drizzle-orm"
import { db } from "~/db"
import { amounts, categories } from "~/db/schema"

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

        // If no amount then there is no data to add to the allYearsData object
        if (!amount) {
          return acc
        }

        // If year doesn't exist, create it
        if (!acc.allYearsData[amount.year]) {
          acc.allYearsData[amount.year] = {}
        }

        // If category doesn't exist, create it
        if (!acc.allYearsData[amount.year]![category.id]) {
          acc.allYearsData[amount.year]![category.id] = {
            ...category,
            monthlyAmounts: Array.from({ length: 12 }).fill({
              id: null,
              amount: 0,
            }) as IMonthlyAmount[],
          }
        }

        // Add amount to monthlyAmounts
        acc.allYearsData[amount.year]![category.id]!.monthlyAmounts[
          amount.month - 1
        ] = { id: amount.id, amount: Number(amount.amount) }

        return acc
      },
      { categories: [], allYearsData: {} } as {
        categories: ICategory[]
        allYearsData: {
          [year: string]: {
            [categoryId: string]: IExtendedCategory
          }
        }
      },
    )

    const formattedData = (() => {
      const allYearsData = Object.keys(reducedData.allYearsData).map((year) => {
        const budgets = Object.values(
          reducedData.allYearsData[year] ?? {},
        ).reduce((acc: any, category: any) => {
          const existingParent = acc.find(
            (item: any) => item.parent === category.parent,
          )
          if (existingParent) {
            existingParent.categoriesData.push(category)
          } else {
            acc.push({
              parent: category.parent,
              categoriesData: [category],
            })
          }
          return acc
        }, [])
        return {
          year: parseInt(year),
          budgets,
        }
      })
      return {
        categories: reducedData.categories,
        allYearsData,
      }
    })()

    // console.log("formattedData >", JSON.stringify(formattedData, null, 2))

    return formattedData
  } catch (error) {
    console.error(error)
    return { categories: [], allYearsData: [] }
  }
}
