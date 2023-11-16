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

export async function updateBudget(): Promise<void> {
  revalidatePath("/")
}

export async function retrieveBudget(year: number): Promise<AmountsModel[]> {
  let data: AmountsModel[] = []

  const parents = [
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
      .where(eq(dbCategories.parent, parent as any))

    const categories = await Promise.all(
      result.map(async (category) => {
        let monthlyAmounts: number[] = []
        const amounts = await db
          .select()
          .from(dbAmounts)
          .where(
            eq(dbAmounts.category, category.id) && eq(dbAmounts.year, year),
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
