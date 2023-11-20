"use client"

import React, { useCallback, type FC, useState, useEffect, useRef } from "react"
import { cn, toTitleCase } from "~/lib/utils"
import YearPicker from "../year-picker"
import { IoAddCircleOutline } from "react-icons/io5"
import { CATEGORY_PARENTS } from "~/lib/constants"
import { MyInput } from "../my-input"

interface BudgetTableClientProps {
  className?: string
  budget: IBudget
}

// TODO: Look into useTranstion when performing revalidation, https://react.dev/reference/react/useTransition
const BudgetTableClient: FC<BudgetTableClientProps> = ({
  className,
  budget,
}) => {
  const [year, setYear] = useState<number>(2023)
  const [yearData, setYearData] = useState<IYearData | null>(
    budget.yearData.find((data) => data.year === year) || null,
  )
  const [categoryData, setCategoryData] = useState<ICategory[] | null>(
    budget.categories || null,
  )
  const [isDirty, setIsDirty] = useState<boolean>(false) // track if any input has been changed, used to determine if we should revalidate (this was suggested by copilot, should I implement it?)
  const refsMatrix = useRef<Map<number, Map<number, ICategoryRef>> | null>(null)

  useEffect(() => {
    console.log("categoryData changed >>>")
    console.log("\trefsMatrix.current")
    console.log("\t ", refsMatrix.current)
  }, [categoryData])

  const hanldeYearChange = useCallback((year: number) => {
    setYear(year)
  }, [])

  const handleAddRow = (categoryParent: CategoryParent) => {
    const newCategory: ICategory = {
      id: "new-category",
      name: "*** DEBUG ME ***",
      parent: categoryParent,
      userId: "",
      ruleId: "",
      createdAt: "",
      updatedAt: "",
    }

    setCategoryData((prev) => {
      if (!prev) return [newCategory]
      return [...prev, newCategory]
    })
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    row: number,
    col: number,
  ) => {
    if (e.shiftKey && e.key === "Enter") {
      e.preventDefault()
      e.stopPropagation()
      refsMatrix.current
        ?.get(row - 1)
        ?.get(col)
        ?.input?.focus()
    } else if (e.key === "Enter") {
      e.preventDefault()
      e.stopPropagation()
      refsMatrix.current
        ?.get(row + 1)
        ?.get(col)
        ?.input?.focus()
    }
  }

  const getMap = () => {
    if (!refsMatrix.current) {
      refsMatrix.current = new Map<number, Map<number, ICategoryRef>>()
    }
    return refsMatrix.current
  }

  let totalRowIndex = 0 // track row index across different parents
  return (
    <>
      <div
        className={cn(
          "sticky left-0 top-0 z-30 flex h-[33px] items-center justify-center border-b bg-white",
          className,
        )}
      >
        <YearPicker onYearChange={hanldeYearChange}>{year}</YearPicker>
      </div>
      <div className="relative">
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
            {CATEGORY_PARENTS.map((categoryParent) => {
              return (
                <React.Fragment key={categoryParent}>
                  {/* Parent Category Row */}
                  <tr key={categoryParent}>
                    <td className="sticky left-0 z-20 border-b bg-white px-1.5 text-base font-normal text-zinc-400 hover:cursor-default hover:bg-white mobile:text-sm">
                      {toTitleCase(categoryParent)}
                    </td>
                    {Array.from({ length: 12 }).map((_, index) => (
                      <td
                        key={index}
                        className="border-b bg-white hover:cursor-default"
                      ></td>
                    ))}
                  </tr>

                  {/* Child Category Rows */}
                  {categoryData &&
                    categoryData
                      .filter((cData) => cData.parent === categoryParent)
                      .map((category) => {
                        const categoryAmounts = yearData?.amounts.find(
                          (amount) =>
                            amount.categories.find((c) => c.id === category.id),
                        )

                        // If no amount data for this category id, add a row with 0s
                        if (!categoryAmounts) {
                          const row = totalRowIndex++
                          return (
                            <tr key={category.id}>
                              <td className="sticky left-0 z-20 border-b border-r bg-white p-0">
                                <MyInput
                                  id={category.id}
                                  key={category.id}
                                  myValue={category.name}
                                  ref={(input) => {
                                    if (input) {
                                      const map = getMap()
                                      if (!map.has(row)) {
                                        map.set(row, new Map())
                                      }
                                      map.get(row)!.set(0, {
                                        input,
                                        category,
                                      })
                                    }
                                  }}
                                  onKeyDown={(e) => handleKeyDown(e, row, 0)}
                                />
                              </td>
                              {Array.from({ length: 12 }).map((_, col) => (
                                <td
                                  key={col}
                                  className={cn(
                                    "relative h-6 border-b border-r p-0",
                                    col === 11 && "border-r-0",
                                  )}
                                >
                                  <MyInput
                                    id={`${category.id}-${col}`}
                                    key={`${category.id}-${col}`}
                                    type="number"
                                    step={"0.01"}
                                    myValue={0}
                                    ref={(input) => {
                                      if (input) {
                                        const map = getMap()
                                        if (!map.has(row)) {
                                          map.set(row, new Map())
                                        }
                                        map.get(row)!.set(col + 1, {
                                          input,
                                          category,
                                        })
                                      }
                                    }}
                                    onKeyDown={(e) =>
                                      handleKeyDown(e, row, col + 1)
                                    }
                                  />
                                </td>
                              ))}
                            </tr>
                          )
                        } else {
                          const row = totalRowIndex++

                          // Monthly amounts will exist if we made it here
                          const monthlyAmounts =
                            categoryAmounts.categories.find(
                              (c) => c.id === category.id,
                            )?.monthlyAmounts

                          return (
                            <tr key={category.id}>
                              <td className="sticky left-0 z-20 border-b border-r bg-white p-0">
                                <MyInput
                                  id={category.id}
                                  key={category.id}
                                  myValue={category.name}
                                  ref={(input) => {
                                    if (input) {
                                      const map = getMap()
                                      if (!map.has(row)) {
                                        map.set(row, new Map())
                                      }
                                      map.get(row)!.set(0, {
                                        input,
                                        category,
                                      })
                                    }
                                  }}
                                  onKeyDown={(e) => handleKeyDown(e, row, 0)}
                                />
                              </td>
                              {monthlyAmounts!.map((amount, col) => (
                                <td
                                  key={col}
                                  className={cn(
                                    "relative h-6 border-b border-r p-0",
                                    col === 11 && "border-r-0",
                                  )}
                                >
                                  <MyInput
                                    id={`${category.id}-${col}`}
                                    key={`${category.id}-${col}`}
                                    type="number"
                                    step={"0.01"}
                                    myValue={amount}
                                    ref={(input) => {
                                      if (input) {
                                        const map = getMap()
                                        if (!map.has(row)) {
                                          map.set(row, new Map())
                                        }
                                        map.get(row)!.set(col + 1, {
                                          input,
                                          category,
                                        })
                                      }
                                    }}
                                    onKeyDown={(e) =>
                                      handleKeyDown(e, row, col + 1)
                                    }
                                  />
                                </td>
                              ))}
                            </tr>
                          )
                        }
                      })}

                  {/* Add Button Row */}
                  <tr key={`add-category-${categoryParent}`}>
                    <td
                      className="sticky left-0 z-10 border-b bg-white pl-3 text-base text-zinc-400 transition hover:cursor-pointer hover:bg-white hover:text-zinc-900 mobile:text-sm"
                      onClick={() => handleAddRow(categoryParent)}
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
      </div>
    </>
  )
}

export default BudgetTableClient
