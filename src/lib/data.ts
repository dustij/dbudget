import { eq } from "drizzle-orm"
import { db } from "~/db"
import { amounts, categories } from "~/db/schema"

export async function getBudgetData(
  userId: string,
): Promise<BudgetModel[] | null> {
  try {
    const rawData = await db
      .select()
      .from(categories)
      .leftJoin(amounts, eq(amounts.categoryId, categories.id))
      .where(eq(categories.userId, userId))

    // console.log("Raw data for user", userId, "==>")
    // console.log(rawData)

    /*
    Raw data for user 1eba6c9a-8c2c-42c8-a13a-630efcce54c5 ==>
    [
      {
        category: {
          id: '64ljmb7sbwfx',
          name: 'rent',
          userId: '1eba6c9a-8c2c-42c8-a13a-630efcce54c5',
          parent: 'fixed',
          ruleId: null,
          createdAt: 2023-11-16T21:40:26.000Z,
          updatedAt: 2023-11-16T21:40:26.000Z
        },
        amount: null
      },
      {
        category: {
          id: '7xckbyfblj8s',
          name: 'netflix',
          userId: '1eba6c9a-8c2c-42c8-a13a-630efcce54c5',
          parent: 'discretionary',
          ruleId: null,
          createdAt: 2023-11-17T18:20:09.000Z,
          updatedAt: 2023-11-17T18:20:09.000Z
        },
        amount: null
      },
      {
        category: {
          id: 'dbl6x2zuetui',
          name: 'gas',
          userId: '1eba6c9a-8c2c-42c8-a13a-630efcce54c5',
          parent: 'variable',
          ruleId: null,
          createdAt: 2023-11-17T18:26:40.000Z,
          updatedAt: 2023-11-17T18:26:40.000Z
        },
        amount: null
      },
      {
        category: {
          id: 'gwbrnfyzmtd4',
          name: 'test',
          userId: '1eba6c9a-8c2c-42c8-a13a-630efcce54c5',
          parent: 'variable',
          ruleId: null,
          createdAt: 2023-11-17T18:32:59.000Z,
          updatedAt: 2023-11-17T18:32:59.000Z
        },
        amount: null
      },
      {
        category: {
          id: 'ir1pr2tufgo3',
          name: 'test2',
          userId: '1eba6c9a-8c2c-42c8-a13a-630efcce54c5',
          parent: 'fixed',
          ruleId: null,
          createdAt: 2023-11-17T18:35:35.000Z,
          updatedAt: 2023-11-17T18:35:35.000Z
        },
        amount: null
      },
      {
        category: {
          id: 'zx6dz4y18e3u',
          name: 'grocereis',
          userId: '1eba6c9a-8c2c-42c8-a13a-630efcce54c5',
          parent: 'variable',
          ruleId: null,
          createdAt: 2023-11-16T21:40:50.000Z,
          updatedAt: 2023-11-16T21:40:50.000Z
        },
        amount: {
          id: 'zf5bu6g2ina4',
          userId: '1eba6c9a-8c2c-42c8-a13a-630efcce54c5',
          amount: '78',
          year: 2023,
          month: '3',
          categoryId: 'zx6dz4y18e3u',
          createdAt: 2023-11-18T12:46:11.000Z,
          updatedAt: 2023-11-18T12:46:11.000Z
        }
      },
      {
        category: {
          id: 'zx6dz4y18e3u',
          name: 'grocereis',
          userId: '1eba6c9a-8c2c-42c8-a13a-630efcce54c5',
          parent: 'variable',
          ruleId: null,
          createdAt: 2023-11-16T21:40:50.000Z,
          updatedAt: 2023-11-16T21:40:50.000Z
        },
        amount: {
          id: 'pz0uz9xaw8ni',
          userId: '1eba6c9a-8c2c-42c8-a13a-630efcce54c5',
          amount: '87',
          year: 2021,
          month: '3',
          categoryId: 'zx6dz4y18e3u',
          createdAt: 2023-11-18T12:45:48.000Z,
          updatedAt: 2023-11-18T12:45:48.000Z
        }
      },
      {
        category: {
          id: 'zx6dz4y18e3u',
          name: 'grocereis',
          userId: '1eba6c9a-8c2c-42c8-a13a-630efcce54c5',
          parent: 'variable',
          ruleId: null,
          createdAt: 2023-11-16T21:40:50.000Z,
          updatedAt: 2023-11-16T21:40:50.000Z
        },
        amount: {
          id: '7nr9eefr39ju',
          userId: '1eba6c9a-8c2c-42c8-a13a-630efcce54c5',
          amount: '99',
          year: 2022,
          month: '2',
          categoryId: 'zx6dz4y18e3u',
          createdAt: 2023-11-18T12:45:26.000Z,
          updatedAt: 2023-11-18T12:45:26.000Z
        }
      },
      {
        category: {
          id: 'zx6dz4y18e3u',
          name: 'grocereis',
          userId: '1eba6c9a-8c2c-42c8-a13a-630efcce54c5',
          parent: 'variable',
          ruleId: null,
          createdAt: 2023-11-16T21:40:50.000Z,
          updatedAt: 2023-11-16T21:40:50.000Z
        },
        amount: {
          id: '47jlaud747al',
          userId: '1eba6c9a-8c2c-42c8-a13a-630efcce54c5',
          amount: '90',
          year: 2023,
          month: '2',
          categoryId: 'zx6dz4y18e3u',
          createdAt: 2023-11-16T21:42:47.000Z,
          updatedAt: 2023-11-16T21:42:47.000Z
        }
      }
    ]
    */

    const budgetData: BudgetModel[] = []

    const reducedData: ReducedData = rawData.reduce((acc, row) => {
      const { category, amount } = row

      if (!amount) {
        // Create dummy container for categories for rows without amounts
        // Later, will add missing categories to the array for each year with at least one amount

        if (!acc[9999]) {
          acc[9999] = {}
        }

        if (!acc[9999][category.id]) {
          acc[9999][category.id] = {
            name: category.name,
            parent: category.parent,
            monthlyAmounts: Array.from({ length: 12 }).fill(0) as number[],
          }
        }

        return acc
      } else {
        // Rows that have an amount
        if (!acc[amount.year]) {
          // If year doesn't exist, create it
          acc[amount.year] = {
            [category.id]: {
              name: category.name,
              parent: category.parent,
              monthlyAmounts: Array.from({ length: 12 }).fill(0) as number[],
            },
          }
        }
        // If year exists, check if category exists
        else if (!acc[amount.year]![category.id]) {
          // If category doesn't exist, create it
          acc[amount.year]![category.id] = {
            name: category.name,
            parent: category.parent,
            monthlyAmounts: Array.from({ length: 12 }).fill(0) as number[],
          }
        }
        // If year and category exist, add amount to monthlyAmounts
        acc[amount.year]![category.id]!.monthlyAmounts[
          parseInt(amount.month) - 1
        ] = Number(amount.amount)

        return acc
      }
    }, {} as ReducedData)

    // {
    //   '2021': {
    //     zx6dz4y18e3u: { name: 'grocereis', parent: 'variable', monthlyAmounts: [Array] }
    //   },
    //   '2022': {
    //     zx6dz4y18e3u: { name: 'grocereis', parent: 'variable', monthlyAmounts: [Array] }
    //   },
    //   '2023': {
    //     '7xckbyfblj8s': {
    //       name: 'netflix',
    //       parent: 'discretionary',
    //       monthlyAmounts: [Array]
    //     },
    //     zx6dz4y18e3u: { name: 'grocereis', parent: 'variable', monthlyAmounts: [Array] }
    //   },
    //   '9999': {
    //     '64ljmb7sbwfx': { name: 'rent', parent: 'fixed', monthlyAmounts: [Array] },
    //     dbl6x2zuetui: { name: 'gas', parent: 'variable', monthlyAmounts: [Array] },
    //     gwbrnfyzmtd4: { name: 'test', parent: 'variable', monthlyAmounts: [Array] },
    //     ir1pr2tufgo3: { name: 'test2', parent: 'fixed', monthlyAmounts: [Array] }
    //   }
    // }

    // Add dummy categories to each year with at least one amount
    Object.keys(reducedData).forEach((year) => {
      if (year !== "9999") {
        Object.keys(reducedData[9999] ?? {}).forEach((categoryId) => {
          if (!reducedData[year]?.[categoryId]) {
            const categoryData = reducedData[9999]?.[categoryId]
            if (categoryData) {
              reducedData[year] = {
                ...(reducedData[year] ?? {}),
                [categoryId]: categoryData,
              }
            }
          }
        })
      }
    })

    // Drop dummy container
    delete reducedData[9999]

    console.log("Reduced data for user", userId, "==>")
    const util = require("util")
    console.log(
      util.inspect(reducedData, {
        showHidden: false,
        depth: null,
        colors: true,
      }),
    )

    const formattedData: BudgetModel[] = Object.keys(reducedData).map(
      (year) => {
        const amounts = Object.keys(reducedData[year]).map((categoryId) => {
          const categoryData = reducedData[year][categoryId]
          return {
            id: categoryId,
            name: categoryData.name,
            parent: categoryData.parent,
            monthlyAmounts: categoryData.monthlyAmounts,
          }
        })

        return {
          year: Number(year),
          amounts,
        }
      },
    )

    console.log("Formatted data for user", userId, "==>")
    console.log(
      util.inspect(formattedData, {
        showHidden: false,
        depth: null,
        colors: true,
      }),
    )

    return formattedData
  } catch (error) {
    console.error(error)
    throw new Error("Error getting budget data")
  }
}
