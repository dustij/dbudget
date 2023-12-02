import { type FC } from "react"
import { z } from "zod"
import { getBudgetData } from "~/lib/data"
import BudgetTableClient from "./budget-table-client"
import { db } from "~/db"
import { categories, amounts } from "~/db/schema"
import { eq } from "drizzle-orm"
import { saveJSONfile } from "~/lib/actions"

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
    // prettier-ignore
    "use server"

    saveJSONfile("temp/.debug.updateServerBudgets.json", data)

    /*
    ========== HANDLE CATEGORIES DATA ==========
    */

    const newCategories = data.categories
      .filter((category) => category.id === null)
      .map((category) => {
        delete category.id
        return CreateCategory.parse(category)
      })

    const updatedCategories = data.categories
      .filter((category) => category.id !== null)
      .map((category) => {
        return UpdateCategory.parse(category)
      })

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

    try {
      for (const category of updatedCategories) {
        await db
          .update(categories)
          .set({ name: category.name })
          .where(eq(categories.id, category.id))
      }
    } catch (e) {
      console.error("Something went wrong while updating categories:")
      console.error(e)
    }

    /*
    ========== HANDLE AMOUNTS DATA ==========
    */

    try {
      // Any new categories should have an id now, so update the category ids in the amounts data
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

    const yearBudgetsWithNewAmounts = data.budgetsByYear.filter((yearBudget) =>
      // These will be year budgets that have at least one amount > 0 with no id
      yearBudget.budgetsByParent.some((parentBudget) =>
        parentBudget.budgetsByCategory.some((category) =>
          category.monthlyAmounts.some(
            (amount) => amount.amount > 0 && !amount.id,
          ),
        ),
      ),
    )

    try {
      const newAmounts = yearBudgetsWithNewAmounts.map((yearBudget) =>
        yearBudget.budgetsByParent.map((parentBudget) =>
          parentBudget.budgetsByCategory.map((category) =>
            category.monthlyAmounts.map((amount, month) => {
              if (amount.amount === 0 || amount.id) {
                // Skip amounts that are 0 or already have an id
                return
              }
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

      // Flatten and remove undefined values
      const flattenedNewAmounts = newAmounts.flat(3).filter((a) => a) as {
        userId: string
        categoryId: string
        amount: number
        year: number
        month: number
      }[]

      await db.insert(amounts).values(flattenedNewAmounts)
    } catch (e) {
      console.error("Something went wrong while inserting new amounts:")
      console.error(e)
    }

    const yearBudgetsWithUpdatedAmounts = data.budgetsByYear.filter(
      // These will be year budgets that have at least one amount amount > 0 with an id
      (yearBudget) =>
        yearBudget.budgetsByParent.some((parentBudget) =>
          parentBudget.budgetsByCategory.some((category) =>
            category.monthlyAmounts.some(
              (amount) => amount.amount > 0 && amount.id,
            ),
          ),
        ),
    )

    try {
      const updatedAmounts = yearBudgetsWithUpdatedAmounts.map((yearBudget) =>
        yearBudget.budgetsByParent.map((parentBudget) =>
          parentBudget.budgetsByCategory.map((category) =>
            category.monthlyAmounts.map((amount, month) => {
              if (amount.amount === 0 || !amount.id) {
                // Skip amounts that are 0 or don't have an id
                return
              }
              return UpdateAmount.parse({
                id: amount.id,
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

      // Flatten and remove undefined values
      const flattenedUpdatedAmounts = updatedAmounts
        .flat(3)
        .filter((a) => a) as {
        id: string
        amount: number
      }[]

      for (const amount of flattenedUpdatedAmounts) {
        await db
          .update(amounts)
          .set({ amount: amount.amount })
          .where(eq(amounts.id, amount.id))
      }
    } catch (e) {
      console.error("Something went wrong while updating amounts:")
      console.error(e)
    }

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
