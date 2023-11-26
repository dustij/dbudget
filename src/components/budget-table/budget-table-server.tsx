import { type FC } from "react"
import { z } from "zod"
import { getBudgetData } from "~/lib/data"
import { eq } from "drizzle-orm"
import { db } from "~/db"
import { amounts, categories } from "~/db/schema"
import BudgetTableClient from "./budget-table-client"

const CategorySchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  parent: z.string().refine(
    (value) => {
      return (
        [
          "income",
          "fixed",
          "variable",
          "discretionary",
          "obligation",
          "leakage",
          "savings",
        ] as const
      ).includes(value as CategoryParent)
    },
    {
      message: "Invalid category parent value",
    },
  ),
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
  const budget = await getBudgetData(userId)

  const insertAmount = async ({
    userId,
    categoryId,
    amount,
    year,
    month,
  }: {
    userId: string
    categoryId: string
    amount: number | string
    year: number | string
    month: number | string
  }): Promise<{
    success: boolean
    id: string | null
  }> => {
    "use server"

    const data = CreateAmount.parse({
      userId,
      categoryId,
      amount,
      year,
      month,
    })

    // mock delayed response, to test for bugs with optimistic updates
    // const delay = (ms: number) =>
    //   new Promise((resolve) => setTimeout(resolve, ms))
    // await delay(5000)
    // console.log("Done mocking delay ...")

    try {
      await db.insert(amounts).values(data)
      try {
        const amount = await db
          .select()
          .from(amounts)
          .where(
            eq(amounts.userId, data.userId) &&
              eq(amounts.categoryId, data.categoryId) &&
              eq(amounts.year, data.year) &&
              eq(amounts.month, data.month),
          )
        if (amount[0]) {
          return { success: true, id: amount[0].id }
        } else {
          throw new Error("Amount not found")
        }
      } catch (error) {
        console.error(`Error retrieving amount (${data.amount}): ${error}`)
        return { success: false, id: null }
      }
    } catch (error) {
      console.error(`Error inserting amount (${data.amount}): ${error}`)
      return { success: false, id: null }
    }
  }

  const updateAmount = async (
    amountId: string,
    newAmount: number | string,
  ): Promise<{ success: boolean }> => {
    "use server"

    const data = UpdateAmount.parse({ id: amountId, amount: newAmount })

    // mock delayed response, to test for bugs with optimistic updates
    // const delay = (ms: number) =>
    //   new Promise((resolve) => setTimeout(resolve, ms))
    // await delay(5000)
    // console.log("Done mocking delay ...")

    try {
      await db
        .update(amounts)
        .set({ amount: data.amount })
        .where(eq(amounts.id, data.id))
      return { success: true }
    } catch (error) {
      console.error(`Error updating amount (${amountId}): ${error}`)
      return { success: false }
    }
  }

  const deleteAmount = async (
    amountId: string,
  ): Promise<{ success: boolean }> => {
    "use server"

    // mock delayed response, to test for bugs with optimistic updates
    // const delay = (ms: number) =>
    //   new Promise((resolve) => setTimeout(resolve, ms))
    // await delay(5000)
    // console.log("Done mocking delay ...")

    try {
      await db.delete(amounts).where(eq(amounts.id, amountId))
      return { success: true }
    } catch (error) {
      console.error(`Error deleting amount (${amountId}): ${error}`)
      return { success: false }
    }
  }

  const insertCategory = async ({
    userId,
    name,
    parent,
  }: {
    userId: string
    name: string
    parent: CategoryParent
  }): Promise<{
    success: boolean
    id: string | null
  }> => {
    "use server"

    const data = CreateCategory.parse({ userId, name, parent }) as {
      userId: string
      name: string
      parent: CategoryParent
    }

    // mock delayed response, to test for bugs with optimistic updates
    // const delay = (ms: number) =>
    //   new Promise((resolve) => setTimeout(resolve, ms))
    // await delay(5000)
    // console.log("Done mocking delay ...")

    try {
      await db.insert(categories).values(data)
      try {
        const category = await db
          .select()
          .from(categories)
          .where(
            eq(categories.userId, data.userId) &&
              eq(categories.name, data.name),
          )
        if (category[0]) {
          return { success: true, id: category[0].id }
        } else {
          throw new Error("Category not found")
        }
      } catch (error) {
        console.error(`Error retrieving category (${data.name}): ${error}`)
        return { success: false, id: null }
      }
    } catch (error) {
      console.error(`Error inserting category (${data.name}): ${error}`)
      return { success: false, id: null }
    }
  }

  const updateCategory = async (
    categoryId: string,
    newName: string,
  ): Promise<{ success: boolean }> => {
    "use server"

    const data = UpdateCategory.parse({ id: categoryId, name: newName })

    // mock delayed response, to test for bugs with optimistic updates
    // const delay = (ms: number) =>
    //   new Promise((resolve) => setTimeout(resolve, ms))
    // await delay(5000)
    // console.log("Done mocking delay ...")

    try {
      await db
        .update(categories)
        .set({ name: data.name })
        .where(eq(categories.id, data.id))
      return { success: true }
    } catch (error) {
      console.error(`Error updating category (${categoryId}): ${error}`)
      return { success: false }
    }
  }

  const deleteCategory = async (
    categoryId: string,
  ): Promise<{ success: boolean }> => {
    "use server"

    // mock delayed response, to test for bugs with optimistic updates
    // const delay = (ms: number) =>
    //   new Promise((resolve) => setTimeout(resolve, ms))
    // await delay(5000)
    // console.log("Done mocking delay ...")

    try {
      await db.delete(categories).where(eq(categories.id, categoryId))
      try {
        await db.delete(amounts).where(eq(amounts.categoryId, categoryId))
        return { success: true }
      } catch (error) {
        console.error(
          `Error deleting amounts for category (${categoryId}): ${error}`,
        )
        return { success: false }
      }
    } catch (error) {
      console.error(`Error deleting category (${categoryId}): ${error}`)
      return { success: false }
    }
  }

  return (
    <BudgetTableClient
      userId={userId}
      budget={budget}
      actions={{
        insertAmount: insertAmount,
        updateAmount: updateAmount,
        deleteAmount: deleteAmount,
        insertCategory: insertCategory,
        updateCategory: updateCategory,
        deleteCategory: deleteCategory,
      }}
    />
  )
}

export default BudgetTableServer
