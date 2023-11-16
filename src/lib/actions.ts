"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "~/db"
import { categories as dbCategories, amounts as dbAmounts } from "~/db/schema"

// import { ExecutedQuery } from "@planetscale/database"
// import { db } from "../db"
// import { users } from "../db/schema"

// export async function selectAllUsers(): Promise<UserModel[]> {
//   const results = await db.select().from(users)
//   return results
// }

// export async function insertUser(user: UserModel): Promise<ExecutedQuery> {
//   const result = await db
//     .insert(users)
//     .values(user)
//     .onDuplicateKeyUpdate({ set: user }) // This is not working, updateAt is not being set
//   return result
// }

export async function updateBudget(
  userId: string,
  category: string,
  parent: CategoryParent,
  isNewCategory: boolean,
  year?: number,
  month?: number | string,
  amount?: number,
): Promise<void> {
  // Insert or update category name into categories table for this user
  if (!category) return
  if (isNewCategory) {
    await db
      .insert(dbCategories)
      .values({
        name: category,
        userId: userId,
        parent: parent,
      })
      .onDuplicateKeyUpdate({ set: { name: category } }) // This may not be the correct approach, insert should not be allowed if category already exists
  } else {
    await db
      .update(dbCategories)
      .set({ name: category })
      .where(eq(dbCategories.name, category) && eq(dbCategories.userId, userId))
  }

  revalidatePath("/")
}

export async function retrieveBudget(
  userId: string,
  year: number,
): Promise<AmountsModel[]> {
  let data: AmountsModel[] = []

  const parents: CategoryParent[] = [
    "income",
    "fixed",
    "variable",
    "discretionary",
    "obligation",
    "leakage",
    "savings",
  ]

  // TODO: is there a way to do this in one query?
  for (const parent of parents) {
    const result = await db
      .select()
      .from(dbCategories)
      .where(eq(dbCategories.parent, parent) && eq(dbCategories.userId, userId))

    console.log("parent", parent)
    console.log("result", result)

    const categories = await Promise.all(
      result.map(async (category) => {
        let monthlyAmounts: number[] = []
        const amounts = await db
          .select()
          .from(dbAmounts)
          .where(
            eq(dbAmounts.category, category.id) &&
              eq(dbAmounts.year, year) &&
              eq(dbAmounts.userId, userId),
          )
        for (let i = 1; i < 13; i++) {
          const amount = amounts.find((amount) => amount.month === i.toString())
          monthlyAmounts.push(amount ? parseFloat(amount.amount) : 0)
        }
        return {
          id: category.id,
          name: category.name,
          monthlyAmounts: monthlyAmounts,
        }
      }),
    )

    data.push({ parent, categories })
  }

  return data
}
