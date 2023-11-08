"use server"

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
