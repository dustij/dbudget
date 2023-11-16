"use client"

import React, { FC, useEffect, useRef, useState } from "react"
import { cn } from "~/lib/utils"
import { IoAddCircleOutline } from "react-icons/io5"
import { MyInput } from "../my-input"
import { revalidatePath } from "next/cache"
import { updateBudget } from "~/lib/actions"

interface BudgetTableClientProps {
  className?: string
  data: AmountsModel[]
}

const BudgetTableClient: FC<BudgetTableClientProps> = ({ data, className }) => {
  const refsMatrix = useRef<(HTMLInputElement | null)[][]>([])
  const [budgetData, setBudgetData] = useState<AmountsModel[]>(data)
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
    if (categoryPosition) {
      refsMatrix.current[categoryPosition[0]]?.[categoryPosition[1]]?.focus()
    }
  }, [categoryPosition])

  const addCategory = (parentIndex: number, rowIndex: number) => {
    const newCategory = {
      id: Math.floor(Math.random() * 1000000), // this is a temporary id
      name: "",
      monthlyAmounts: Array.from({ length: 12 }).fill(0) as number[],
    }
    setBudgetData((prevData) => {
      const newData = [...prevData]
      const parent = newData[parentIndex]! // Can use assertion here because parentIndex is created when mapping over budgetData parents
      const categories = parent.categories ?? []
      const newCategories = [...categories.slice(0, rowIndex + 1), newCategory]
      newData[parentIndex] = {
        ...parent,
        categories: newCategories,
      }
      const subCategories = newData.flatMap((parent) => parent.categories)
      const newRowIndex = subCategories.findIndex((cat) => cat === newCategory)
      setCategoryPosition([newRowIndex, 0])
      return newData
    })
  }

  const handleSubmit = (e: React.FocusEvent) => {
    e.preventDefault()
    updateBudget()
  }

  // TODO: add style to first column to highlight it, makes it easier to see which category you're editing
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number,
  ) => {
    if ((e.key === "Enter" && !e.shiftKey) || e.key === "ArrowDown") {
      // Move focus to the next input one row down in the same column
      e.preventDefault()
      const nextRowIndex = rowIndex + 1
      if (nextRowIndex < refsMatrix.current.length) {
        refsMatrix.current[nextRowIndex]?.[colIndex]?.focus()
      } else {
        // Move focus to the first input in the next column
        const nextColIndex = colIndex + 1
        // Can use assertion here because we know that the first row exists (because we're in it)
        if (nextColIndex < refsMatrix.current[0]!.length) {
          refsMatrix.current[0]?.[nextColIndex]?.focus()
        } else {
          // Blur the current input
          e.currentTarget.blur()
        }
      }
    } else if ((e.key === "Enter" && e.shiftKey) || e.key === "ArrowUp") {
      // Move focus to the previous input one row up in the same column
      e.preventDefault()
      const prevRowIndex = rowIndex - 1
      if (prevRowIndex >= 0) {
        refsMatrix.current[prevRowIndex]?.[colIndex]?.focus()
      } else {
        // Move focus to the last input in the previous column
        const prevColIndex = colIndex - 1
        if (prevColIndex >= 0) {
          refsMatrix.current[refsMatrix.current.length - 1]?.[
            prevColIndex
          ]?.focus()
        } else {
          // Blur the current input
          e.currentTarget.blur()
        }
      }
    } else if (e.key === "ArrowLeft") {
      // Move focus to the previous input to the left in the same row
      e.preventDefault()
      const prevColIndex = colIndex - 1
      if (prevColIndex >= 0) {
        refsMatrix.current[rowIndex]?.[prevColIndex]?.focus()
      } else {
        // Move focus to the last input in the previous row
        const prevRowIndex = rowIndex - 1
        if (prevRowIndex >= 0) {
          refsMatrix.current[prevRowIndex]?.[
            // Can use assertion here because we know that the previous row exists (because we just checked)
            refsMatrix.current[prevRowIndex]!.length - 1
          ]?.focus()
        } else {
          // Blur the current input
          e.currentTarget.blur()
        }
      }
    } else if (e.key === "ArrowRight") {
      // Move focus to the next input to the right in the same row
      e.preventDefault()
      const nextColIndex = colIndex + 1
      if (refsMatrix.current[rowIndex]?.[nextColIndex]) {
        refsMatrix.current[rowIndex]?.[nextColIndex]?.focus()
      } else {
        // Move focus to the first input in the next row
        const nextRowIndex = rowIndex + 1
        if (refsMatrix.current[nextRowIndex]?.[0]) {
          refsMatrix.current[nextRowIndex]?.[0]?.focus()
        } else {
          // Blur the current input
          e.currentTarget.blur()
        }
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
        "w-full min-w-[1070px] table-fixed border-separate border-spacing-0 bg-white text-[14px]",
        className,
      )}
    >
      <thead className="sticky top-[33px] z-30 h-[33px] bg-white">
        <tr>
          <th className="sticky left-0 cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r bg-white px-1.5 text-left text-base font-normal text-zinc-400">
            Category
          </th>
          <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r bg-white px-1.5 text-right text-base font-normal text-zinc-400">
            Jan
          </th>
          <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r bg-white px-1.5 text-right text-base font-normal text-zinc-400">
            Feb
          </th>
          <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r bg-white px-1.5 text-right text-base font-normal text-zinc-400">
            Mar
          </th>
          <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r bg-white px-1.5 text-right text-base font-normal text-zinc-400">
            Apr
          </th>
          <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r bg-white px-1.5 text-right text-base font-normal text-zinc-400">
            May
          </th>
          <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r bg-white px-1.5 text-right text-base font-normal text-zinc-400">
            Jun
          </th>
          <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r bg-white px-1.5 text-right text-base font-normal text-zinc-400">
            Jul
          </th>
          <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r bg-white px-1.5 text-right text-base font-normal text-zinc-400">
            Aug
          </th>
          <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r bg-white px-1.5 text-right text-base font-normal text-zinc-400">
            Sep
          </th>
          <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r bg-white px-1.5 text-right text-base font-normal text-zinc-400">
            Oct
          </th>
          <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r bg-white px-1.5 text-right text-base font-normal text-zinc-400">
            Nov
          </th>
          <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b bg-white px-1.5 text-right text-base font-normal text-zinc-400">
            Dec
          </th>
        </tr>
      </thead>
      <tbody>
        {budgetData.map((data, parentIndex) => {
          return (
            <React.Fragment key={parentIndex}>
              <tr key={parentIndex}>
                <td className="sticky left-0 z-20 border-b bg-white px-1.5 text-base font-normal text-zinc-400 hover:cursor-default hover:bg-white mobile:text-sm">
                  {data.parent.toUpperCase()}
                </td>
                {Array.from({ length: 12 }).map((_, index) => (
                  <td
                    key={index}
                    className="border-b bg-white hover:cursor-default"
                  ></td>
                ))}
              </tr>
              {data.categories.map((category, rowIndex) => {
                // Increment totalRowIndex for each row
                const currentRowIndex = totalRowIndex++
                return (
                  <React.Fragment key={category.id}>
                    <tr key={category.id}>
                      <td className="sticky left-0 z-20 border-b border-r bg-white p-0">
                        <MyInput
                          myValue={category.name}
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
                        <td
                          key={colIndex}
                          className={cn(
                            "relative h-6 border-b border-r p-0",
                            colIndex === 11 && "border-r-0",
                          )}
                        >
                          <MyInput
                            type="number"
                            step={"0.01"}
                            myValue={amount}
                            ref={(input) => {
                              refsMatrix.current[currentRowIndex]![
                                colIndex + 1
                              ] = input
                            }}
                            onFocus={(e) => e.currentTarget.select()}
                            onLoseFocus={(e) => handleSubmit(e)}
                            onKeyDown={(e) =>
                              handleKeyDown(e, currentRowIndex, colIndex + 1)
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  </React.Fragment>
                )
              })}
              <tr key={`add-category-${parentIndex}`}>
                <td
                  className="sticky left-0 z-10 border-b bg-white pl-3 text-base text-zinc-400 transition hover:cursor-pointer hover:bg-white hover:text-zinc-900 mobile:text-sm"
                  onClick={() =>
                    addCategory(parentIndex, data.categories.length - 1)
                  }
                >
                  <IoAddCircleOutline className="mr-1 inline-block h-full pb-[2px]" />
                  Add
                </td>
                {Array.from({ length: 12 }).map((_, index) => (
                  <td
                    key={index}
                    className="border-b bg-white hover:cursor-default"
                  ></td>
                ))}
              </tr>
            </React.Fragment>
          )
        })}
      </tbody>
    </table>
  )
}

export default BudgetTableClient
