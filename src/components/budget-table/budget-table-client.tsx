"use client"

import React, { FC, useEffect, useRef, useState } from "react"
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

  const handleSubmit = (e: React.FocusEvent) => {
    e.preventDefault()
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
      }
    } else if ((e.key === "Enter" && e.shiftKey) || e.key === "ArrowUp") {
      // Move focus to the previous input one row up in the same column
      e.preventDefault()
      const prevRowIndex = rowIndex - 1
      if (prevRowIndex >= 0) {
        refsMatrix.current[prevRowIndex]?.[colIndex]?.focus()
      }
    } else if (e.key === "ArrowLeft") {
      // Move focus to the previous input to the left in the same row
      e.preventDefault()
      const prevColIndex = colIndex - 1
      if (prevColIndex >= 0) {
        refsMatrix.current[rowIndex]?.[prevColIndex]?.focus()
      }
    } else if (e.key === "ArrowRight") {
      // Move focus to the next input to the right in the same row
      e.preventDefault()
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
        {budgetData.map((parent, parentIndex) => {
          return (
            <React.Fragment key={parent.id}>
              <tr key={parent.id}>
                <td className="sticky left-0 z-10 text-base mobile:text-sm">
                  {parent.name}
                </td>
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
                      <td className="sticky left-0 z-10 ">
                        <input
                          className="w-full text-base mobile:text-sm"
                          defaultValue={category.name}
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
                            type="number"
                            className="w-full text-base mobile:text-sm"
                            defaultValue={amount}
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