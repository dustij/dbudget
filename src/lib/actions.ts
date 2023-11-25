"use server"

import { revalidatePath } from "next/cache"

// Function to perform the revalidation
export const performRevalidation = async () => {
  const pathToRevalidate = "/"
  revalidatePath(pathToRevalidate)
}
