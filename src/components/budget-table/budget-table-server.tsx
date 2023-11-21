import { Suspense, type FC } from "react"
import { getBudgetData } from "~/lib/data"
import BudgetTableClient from "./budget-table-client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

interface BudgetTableServerProps {
  userId: string
}

const BudgetTableServer: FC<BudgetTableServerProps> = async ({ userId }) => {
  const budget = await getBudgetData(userId)

  const updateBudget = async (): Promise<{ success: boolean }> => {
    "use server"
    console.log("Updating budget...")
    /*
    - Extract data
    - Validate and prepare data
      - Type validation and coercion
      - Storing values as cents
    - Insert data into database
    - Return success or error
     */
    return { success: true }
  }

  const insertIntoBudget = async (): Promise<{
    success: boolean
    id: string | null
  }> => {
    "use server"
    console.log("Insert into budget...")
    /*
    - Extract data
    - Validate and prepare data
      - Type validation and coercion
      - Storing values as cents
    - Insert data into database
    - Return category id if success or null if error
     */
    return { success: false, id: null }
  }

  return (
    <BudgetTableClient
      budget={budget}
      actions={{ updateBudget, insertIntoBudget }}
    />
  )
}

export default BudgetTableServer
