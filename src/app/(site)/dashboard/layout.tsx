import Header from "./header"
import { getServerAuthSession } from "~/app/api/auth/[...nextauth]/options"
import { redirect } from "next/navigation"

interface DashboardProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardProps> = async ({ children }) => {
  const session = await getServerAuthSession()

  if (!session) {
    redirect("/")
  }

  return (
    <>
      <Header user={session.user} />
      <div className="my-content border-b border-l border-r bg-zinc-50">
        {children}
      </div>
    </>
  )
}

export default DashboardLayout
