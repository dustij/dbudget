"use client"

import { FC, useRef } from "react"
import { CategoryParent } from "../../../../temp/categories"
import { cn } from "~/lib/utils"

interface BudgetTableClientProps {
  className?: string
  data: CategoryParent[]
}

const BudgetTableClient: FC<BudgetTableClientProps> = ({ data, className }) => {
  const refsMatrix = useRef<(HTMLInputElement | null)[][]>([])
  for (const i of Array(data.length).keys()) {
    const categoryParent = data[i]
    for (const g of Array.from({
      length: categoryParent?.categories.length ?? 0,
    }).keys()) {
      refsMatrix.current[g * (i + 1)] = []
      for (const j of Array(13).keys()) {
        // we just initialized refsMatrix.current[i] to [], so it's safe to use a non-null assertion here
        refsMatrix.current[g * (i + 1)]![j] = null
      }
    }
  }

  console.log(refsMatrix)

  return (
    <table
      className={cn(
        "w-full min-w-[1070px] table-fixed border-separate border-spacing-0 text-[14px]",
        className,
      )}
    >
      <tbody>
        {data.map((parent) => {
          return (
            <>
              <tr key={parent.id}>
                <td>{parent.name}</td>
                {Array.from({ length: 12 }).map((_, index) => (
                  <td key={index}></td>
                ))}
              </tr>
              {parent.categories.map((category, rowIndex) => {
                return (
                  <tr key={category.id}>
                    <td>
                      <input
                        className="w-full"
                        value={category.name}
                        ref={(input) => {
                          refsMatrix.current[rowIndex]![0] = input
                        }}
                      />
                    </td>
                    <td>
                      <input
                        className="w-full"
                        value={category.jan}
                        ref={(input) => {
                          refsMatrix.current[rowIndex]![1] = input
                        }}
                      />
                    </td>
                    <td>{category.feb}</td>
                    <td>{category.mar}</td>
                    <td>{category.apr}</td>
                    <td>{category.may}</td>
                    <td>{category.jun}</td>
                    <td>{category.jul}</td>
                    <td>{category.aug}</td>
                    <td>{category.sep}</td>
                    <td>{category.oct}</td>
                    <td>{category.nov}</td>
                    <td>{category.dec}</td>
                  </tr>
                )
              })}
            </>
          )
        })}
      </tbody>
    </table>
  )
}

export default BudgetTableClient
