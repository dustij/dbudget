import type { FC } from "react"

interface StatusBarProps {
  onClick: () => void
}

const StatusBar: FC<StatusBarProps> = ({ onClick }) => {
  return <div>StatusBar</div>
}

export default StatusBar
