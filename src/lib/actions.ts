"use server"

import { revalidatePath } from "next/cache"

// Function to perform the revalidation
export const performRevalidation = async () => {
  const pathToRevalidate = "/"
  revalidatePath(pathToRevalidate)
}

export const saveJSONfile = async (path: string, data: any) => {
  const fs = require("fs")
  const filePath = path
  const fileData = JSON.stringify(data, null, 2)
  fs.writeFileSync(filePath, fileData)
}
