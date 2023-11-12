import type { FC } from "react"
import MatrixTable from "~/components/matrix-table/matrix-table"

interface JournalProps {}

const Journal: FC<JournalProps> = () => {
  const data = []

  return (
    <div className="flex items-center justify-center">
      <MatrixTable></MatrixTable>
    </div>
  )
}

export default Journal
