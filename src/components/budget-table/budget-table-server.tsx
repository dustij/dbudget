import { type FC } from "react"
import { z } from "zod"
import { getBudgetData } from "~/lib/data"
import BudgetTableClient from "./budget-table-client"
import { db } from "~/db"
import { categories, amounts } from "~/db/schema"
import { saveJSONfile } from "~/lib/actions"
import { eq } from "drizzle-orm"

const CategorySchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  parent: z.union([
    z.literal("income"),
    z.literal("fixed"),
    z.literal("variable"),
    z.literal("discretionary"),
    z.literal("obligation"),
    z.literal("leakage"),
    z.literal("savings"),
  ]),
})

const AmountSchema = z.object({
  id: z.string(),
  userId: z.string(),
  categoryId: z.string(),
  amount: z.coerce.number().int(), // int because saving amounts in cents
  year: z.coerce
    .number()
    .int()
    .refine((value) => value.toString().length === 4, {
      message: "Year must be a 4-digit integer",
    }),
  month: z.coerce
    .number()
    .int()
    .refine((value) => value >= 1 && value <= 12, {
      message: "Month must be an integer between 1 and 12",
    }),
})

const CreateCategory = CategorySchema.omit({ id: true })
const CreateAmount = AmountSchema.omit({ id: true })

const UpdateCategory = CategorySchema.pick({ id: true, name: true })
const UpdateAmount = AmountSchema.pick({ id: true, amount: true })

interface BudgetTableServerProps {
  userId: string
}

const BudgetTableServer: FC<BudgetTableServerProps> = async ({ userId }) => {
  const data = await getBudgetData(userId)

  const getServerBudgets = async () => {
    "use server"
    return getBudgetData(userId)
  }

  const updateServerBudgets = async (data: IBudgetData) => {
    "use server"

    /*
    ========== NEW CATEGORIES ==========
    */

    const newCategories = data.categories
      .filter((category) => category.id === null)
      .map((category) => {
        delete category.id
        return CreateCategory.parse(category)
      })

    // drizzle insert new categories to get ids
    try {
      await db.insert(categories).values(newCategories)
      try {
        const newCategoryData = await db
          .select()
          .from(categories)
          .where(eq(categories.userId, userId))

        data.categories = newCategoryData
      } catch (e) {
        console.error("Something went wrong while getting new categories:")
        console.error(e)
      }
    } catch (e) {
      console.error("Something went wrong while inserting new categories:")
      console.error(e)
    }

    // update new category ids in amounts
    try {
      data.budgetsByYear.forEach((yearBudget) => {
        yearBudget.budgetsByParent.forEach((parentBudget) => {
          const nullCategories = parentBudget.budgetsByCategory.filter(
            (c) => c.id === null,
          )
          nullCategories.forEach((category) => {
            const newCategory = data.categories.find(
              (c) => c.name === category.name,
            )
            if (!newCategory) {
              throw new Error(
                `Could not find new category in categories with name: ${category.name}`,
              )
            }
            const newCategoryId = newCategory.id
            if (!newCategoryId) {
              throw new Error(
                `Could not find new category id in categories for category with name: ${category.name}`,
              )
            }
            category.id = newCategoryId
          })
        })
      })
    } catch (e) {
      console.error("Something went wrong while updating new category ids:")
      console.error(e)
    }

    /*
    ========== NEW AMOUNTS ==========
    */

    const yearBudgetsWithNewAmounts = data.budgetsByYear.filter((yearBudget) =>
      yearBudget.budgetsByParent.some((parentBudget) =>
        parentBudget.budgetsByCategory.some((category) =>
          category.monthlyAmounts.some(
            (amount) => amount.amount > 0 && amount.id === null,
          ),
        ),
      ),
    )

    const newAmounts = yearBudgetsWithNewAmounts.map((yearBudget) =>
      yearBudget.budgetsByParent.map((parentBudget) =>
        parentBudget.budgetsByCategory.map((category) =>
          category.monthlyAmounts.map((amount, month) => {
            if (amount.amount <= 0 || amount.id !== null) {
              return null
            }
            delete amount.id
            return CreateAmount.parse({
              userId: userId,
              categoryId: category.id,
              amount: amount.amount,
              year: yearBudget.year,
              month: month + 1,
            })
          }),
        ),
      ),
    )

    // flatten array
    const flattenedNewAmounts = newAmounts
      .flat(3)
      .filter((amount) => amount !== null) as {
      userId: string
      categoryId: string
      amount: number
      year: number
      month: number
    }[]

    try {
      await db.insert(amounts).values(flattenedNewAmounts)
    } catch (e) {
      console.error("Something went wrong while inserting new amounts:")
      console.error(e)
    }

    saveJSONfile("temp/.debug.data.json", data)

    return getBudgetData(userId)
  }

  return (
    <BudgetTableClient
      data={data}
      userId={userId}
      action={{ getServerBudgets, updateServerBudgets }}
    />
  )
}

export default BudgetTableServer
