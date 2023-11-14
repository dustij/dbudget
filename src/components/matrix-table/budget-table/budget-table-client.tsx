"use client"

import React, {
  FC,
  FocusEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react"
import { CategoryParent } from "../../../../temp/categories"
import { cn } from "~/lib/utils"
import { IoAddCircleOutline } from "react-icons/io5"

interface BudgetTableClientProps {
  className?: string
  data: CategoryParent[]
}

const BudgetTableClient: FC<BudgetTableClientProps> = ({ data, className }) => {
  const refsMatrix = useRef<(HTMLInputElement | null)[][]>([])
  const [budgetData, setBudgetData] = useState<CategoryParent[]>(data)
  const [categoryPosition, setCategoryPosition] = useState<
    [number, number] | null
  >(null) // [row, col]

  const subCategories = budgetData.flatMap((parent) => parent.categories)

  // Initialize refsMatrix.current to a matrix of nulls
  for (const rowIndex of Array(subCategories.length).keys()) {
    refsMatrix.current[rowIndex] = []
    for (const colIndex of Array(13).keys()) {
      // 13 because 12 months + 1 for category name
      refsMatrix.current[rowIndex]![colIndex] = null
    }
  }

  useEffect(() => {
    refsMatrix.current[categoryPosition?.[0] ?? 0]?.[
      categoryPosition?.[1] ?? 0
    ]?.focus()
  }, [categoryPosition])

  const addCategory = (parentIndex: number, rowIndex: number) => {
    const newCategory = {
      id: Math.floor(Math.random() * 1000000), // this is a temporary id
      name: "",
      monthlyAmounts: Array.from({ length: 12 }).fill(0) as number[],
    }
    setBudgetData((prevData) => {
      const newData = [...prevData]
      const parent = newData[parentIndex]
      const categories = parent?.categories ?? []
      const newCategories = [...categories.slice(0, rowIndex + 1), newCategory]
      newData[parentIndex] = {
        ...parent!,
        categories: newCategories,
        id: parent?.id || Math.floor(Math.random() * 1000000),
        name: parent?.name || "", // add a fallback value for name
      }
      const subCategories = newData.flatMap((parent) => parent.categories)
      const newRowIndex = subCategories.findIndex((cat) => cat === newCategory)
      setCategoryPosition([newRowIndex, 0])
      return newData
    })
  }

  const handleSubmit = (e: FocusEvent) => {
    e.preventDefault()
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number,
  ) => {
    if ((e.key === "Enter" && !e.shiftKey) || e.key === "ArrowDown") {
      e.preventDefault()
      // Move focus to the next input one row down in the same column
      const nextRowIndex = rowIndex + 1
      if (nextRowIndex < refsMatrix.current.length) {
        refsMatrix.current[nextRowIndex]?.[colIndex]?.focus()
      }
    } else if ((e.key === "Enter" && e.shiftKey) || e.key === "ArrowUp") {
      e.preventDefault()
      // Move focus to the previous input one row up in the same column
      const prevRowIndex = rowIndex - 1
      if (prevRowIndex >= 0) {
        refsMatrix.current[prevRowIndex]?.[colIndex]?.focus()
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      // Move focus to the previous input to the left in the same row
      const prevColIndex = colIndex - 1
      if (prevColIndex >= 0) {
        refsMatrix.current[rowIndex]?.[prevColIndex]?.focus()
      }
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      // Move focus to the next input to the right in the same row
      const nextColIndex = colIndex + 1
      if (refsMatrix.current[rowIndex]?.[nextColIndex]) {
        refsMatrix.current[rowIndex]?.[nextColIndex]?.focus()
      }
    } else if (e.key === "Escape") {
      // Blur the current input
      e.currentTarget.blur()
    }
  }

  let totalRowIndex = 0 // track row index across different parents
  return (
    <table
      className={cn(
        "w-full min-w-[1070px] table-fixed border-separate border-spacing-0 text-[14px]",
        className,
      )}
    >
      <tbody>
        {budgetData.map((parent, parentIndex) => {
          return (
            <React.Fragment key={parent.id}>
              <tr key={parent.id}>
                <td>{parent.name}</td>
                {Array.from({ length: 12 }).map((_, index) => (
                  <td key={index}></td>
                ))}
              </tr>
              {parent.categories.map((category, rowIndex) => {
                // Increment totalRowIndex for each row
                const currentRowIndex = totalRowIndex++
                return (
                  <React.Fragment key={category.id}>
                    <tr key={category.id}>
                      <td>
                        <input
                          className="w-full"
                          defaultValue={category.name}
                          // value={category.name}
                          ref={(input) => {
                            refsMatrix.current[currentRowIndex]![0] = input
                          }}
                          onFocus={(e) => e.currentTarget.select()}
                          onBlur={(e) => handleSubmit(e)}
                          onKeyDown={(e) =>
                            handleKeyDown(e, currentRowIndex, 0)
                          }
                        />
                      </td>

                      {category.monthlyAmounts.map((amount, colIndex) => (
                        <td key={colIndex}>
                          <input
                            className="w-full"
                            defaultValue={amount}
                            // value={amount}
                            ref={(input) => {
                              refsMatrix.current[currentRowIndex]![
                                colIndex + 1
                              ] = input
                            }}
                            onFocus={(e) => e.currentTarget.select()}
                            onBlur={(e) => handleSubmit(e)}
                            onKeyDown={(e) =>
                              handleKeyDown(e, currentRowIndex, colIndex + 1)
                            }
                          />
                        </td>
                      ))}
                    </tr>
                    {rowIndex === parent.categories.length - 1 && (
                      <tr key={`add-category-${parent.id}`}>
                        <td
                          className="sticky left-0 z-10 pl-3 text-zinc-400 transition hover:cursor-pointer hover:bg-zinc-50 hover:text-zinc-900"
                          onClick={() => addCategory(parentIndex, rowIndex)}
                        >
                          <IoAddCircleOutline className="mr-1 inline-block" />
                          Add
                        </td>
                        {Array.from({ length: 12 }).map((_, index) => (
                          <td key={index}></td>
                        ))}
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </React.Fragment>
          )
        })}
      </tbody>
    </table>
  )
}

export default BudgetTableClient
