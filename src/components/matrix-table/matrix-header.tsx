import type { FC } from "react"
import { cn } from "~/lib/utils"

interface MatrixHeaderProps {
  className?: string
  children?: React.ReactNode
}

export const MatrixHeader: FC<MatrixHeaderProps> = ({
  className,
  children,
}) => {
  return (
    <thead className={cn("sticky top-0 z-30 h-[33px] bg-white", className)}>
      <tr>{children}</tr>
    </thead>
  )
}

interface MatrixHeaderCellProps {
  className?: string
  children?: React.ReactNode
}

export const MatrixHeaderCell: FC<MatrixHeaderCellProps> = ({
  className,
  children,
}) => {
  return (
    <th
      className={cn(
        "cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r px-1.5 text-right text-base font-normal text-zinc-400",
        className,
      )}
    >
      {children}
    </th>
  )
}
