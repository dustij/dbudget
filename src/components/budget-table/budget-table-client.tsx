"use client"

import React, { useCallback, type FC, useState, useEffect, useRef } from "react"
import { cn, toTitleCase } from "~/lib/utils"
import YearPicker from "../year-picker"
import { IoAddCircleOutline } from "react-icons/io5"
import { CATEGORY_PARENTS } from "~/lib/constants"
import { MyInput } from "../my-input"

interface BudgetTableClientProps {
  userId: string
  budget: IBudget
  actions: {
    insertAmount: ({
      userId,
      amount,
      year,
      month,
      categoryId,
    }: {
      userId: string
      amount: number | string
      year: number | string
      month: number | string
      categoryId: string
    }) => Promise<{
      success: boolean
      id: string | null
    }>
    updateAmount: () => Promise<{ success: boolean }>
    insertCategory: ({
      userId,
      name,
      parent,
    }: {
      userId: string
      name: string
      parent: CategoryParent
    }) => Promise<{
      success: boolean
      id: string | null
    }>
    updateCategory: () => Promise<{ success: boolean }>
  }
}

const BudgetTableClient: FC<BudgetTableClientProps> = ({
  userId,
  budget,
  actions,
}) => {
  const [year, setYear] = useState<number>(2023)
  const [yearData, setYearData] = useState<IYearData | null>(
    budget.yearData.find((data) => data.year === year) || null,
  )
  const [categoryData, setCategoryData] = useState<ICategory[] | null>(
    budget.categories || null,
  )
  const refsMatrix = useRef<Map<number, Map<number, ICategoryRef>> | null>(null)

  useEffect(() => {
    // find ICategoryRef with id 'new-category' and focus on it
    const newCategoryRef = Array.from(refsMatrix.current?.values() || [])
      .flat()
      .find((ref) => ref.values().next().value.category.id === "new-category")

    newCategoryRef?.get(0)?.input?.focus()
  }, [categoryData])

  const hanldeYearChange = useCallback((year: number) => {
    setYear(year)
  }, [])

  const handleAddRow = (categoryParent: CategoryParent) => {
    const newCategory: ICategory = {
      id: "new-category",
      name: "",
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
    if (e.shiftKey && e.key === "Tab") {
      /**
       * If shift + tab, move focus upwards
       */
      e.preventDefault()
      e.stopPropagation()
      // If we're on the first row
      if (row === 0) {
        // If we're on the first column, blur the input
        if (col === 0) {
          refsMatrix.current?.get(row)?.get(col)?.input?.blur()
          return
        }
        // Move focus to the last input of the previous column
        refsMatrix.current
          ?.get(totalRowIndex - 1)
          ?.get(col - 1)
          ?.input?.focus()
        return
      }
      // Move focus to the input above
      refsMatrix.current
        ?.get(row - 1)
        ?.get(col)
        ?.input?.focus()
    } else if (e.key === "Tab") {
      /**
       * If tab, move focus downards
       */
      e.preventDefault()
      e.stopPropagation()
      // If we're on the last row
      if (row === totalRowIndex - 1) {
        // If we're on the last column, blur the input
        if (col === 11) {
          refsMatrix.current?.get(row)?.get(col)?.input?.blur()
          return
        }
        // Move focus to the first input of the next column
        refsMatrix.current
          ?.get(0)
          ?.get(col + 1)
          ?.input?.focus()
        return
      }
      // Move focus to the input below
      refsMatrix.current
        ?.get(row + 1)
        ?.get(col)
        ?.input?.focus()
    } else if (e.shiftKey && e.key === "Enter") {
      /**
       * If shift + enter, move focus backwards
       */
      e.preventDefault()
      e.stopPropagation()
      // If we're on the first column
      if (col === 0) {
        // If we're on the first row, blur the input
        if (row === 0) {
          refsMatrix.current?.get(row)?.get(col)?.input?.blur()
          return
        }
        // Move focus to the last input of the previous column
        refsMatrix.current
          ?.get(row - 1)
          ?.get(11)
          ?.input?.focus()
        return
      }
      // Move focus to the input to the left
      refsMatrix.current
        ?.get(row)
        ?.get(col - 1)
        ?.input?.focus()
    } else if (e.key === "Enter") {
      /**
       * If enter, move focus forwards
       */
      e.preventDefault()
      e.stopPropagation()
      // If we're on the last column
      if (col === 11) {
        // If we're on the last row, blur the input
        if (row === totalRowIndex - 1) {
          refsMatrix.current?.get(row)?.get(col)?.input?.blur()
          return
        }
        // Move focus to the first input of the next column
        refsMatrix.current
          ?.get(row + 1)
          ?.get(0)
          ?.input?.focus()
        return
      }
      // Move focus to the input to the right
      refsMatrix.current
        ?.get(row)
        ?.get(col + 1)
        ?.input?.focus()
    } else if (e.key === "Escape") {
      /**
       * If escape, blur the input
       */
      e.preventDefault()
      e.stopPropagation()
      refsMatrix.current?.get(row)?.get(col)?.input?.blur()
    }
  }

  const hanldeInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.id === "new-category") {
      const newCategoryName = e.target.value.trim()
      if (!newCategoryName) {
        setCategoryData((prev) => {
          if (!prev) return null
          return prev.filter((c) => c.id !== "new-category")
        })
        return
      } else {
        // Insert new category
        actions
          .insertCategory({
            userId,
            name: newCategoryName,
            parent: e.target.dataset.parent as CategoryParent,
          })
          .then(({ success, id }) => {
            if (success && id) {
              return setCategoryData((prev) => {
                if (!prev) return null
                return prev.map((c) => {
                  if (c.id === "new-category") {
                    return {
                      ...c,
                      id,
                      name: newCategoryName,
                    }
                  }
                  return c
                })
              })
            }
            console.error(`! Error inserting category: ${newCategoryName}`)
            alert(
              `Error inserting category: ${newCategoryName} (replace with with a toast)`,
            )
            setCategoryData((prev) => {
              if (!prev) return null
              return prev.filter((c) => c.id !== "new-category")
            })
          })
        return
      }
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
        className={
          "sticky left-0 top-0 z-30 flex h-[33px] items-center justify-center border-b bg-white"
        }
      >
        <YearPicker onYearChange={hanldeYearChange}>{year}</YearPicker>
      </div>
      <div className="relative">
        <table
          className={
            "w-full min-w-[1070px] table-fixed border-separate border-spacing-0 bg-white text-[14px]"
          }
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
                                  data-parent={category.parent}
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
                                  onFocus={(e) => e.target.select()}
                                  onBlur={(e) => hanldeInputBlur(e)}
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
                                    data-parent={category.parent}
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
                                    onFocus={(e) => e.target.select()}
                                    onBlur={(e) => hanldeInputBlur(e)}
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
                                  data-parent={category.parent}
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
                                  onFocus={(e) => e.target.select()}
                                  onBlur={(e) => hanldeInputBlur(e)}
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
                                    data-parent={category.parent}
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
                                    onFocus={(e) => e.target.select()}
                                    onBlur={(e) => hanldeInputBlur(e)}
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
