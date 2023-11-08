import type { NextPage } from "next"
import { redirect } from "next/navigation"

const Dashboard: NextPage = async () => {
  redirect("/dashboard/budget")
}

export default Dashboard
