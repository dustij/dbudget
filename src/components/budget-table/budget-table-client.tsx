"use client"

import React, { type FC, useState, useEffect, useRef } from "react"
import { cn, formatCurrency, toTitleCase } from "~/lib/utils"
import YearPicker from "../year-picker"
import { IoAddCircleOutline } from "react-icons/io5"
import { CATEGORY_PARENTS } from "~/lib/constants"
import { MyInput } from "../my-input"
import { useLogContext } from "~/context/log-context"

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
  const { addLog } = useLogContext()

  let totalRowIndex = 0 // track row index across different parents

  useEffect(() => {
    console.log("USE EFFECT [categoryData] @", new Date().toLocaleTimeString())
    if (refsMatrix.current && categoryData) {
      if (refsMatrix.current.size > categoryData.length) {
        const lastRow = refsMatrix.current.size - 1
        refsMatrix.current.delete(lastRow)
      }
      // focus on input without id
      const inputWithoutId = findCategoryInputWithoutId()
      if (inputWithoutId) {
        inputWithoutId.focus()
      }
    }

    console.log(`\tcategoryData:`, categoryData)
    console.log(`\trefsMatrix:`, refsMatrix.current)
  }, [categoryData])

  const findCategoryInputWithoutId = () => {
    if (refsMatrix.current) {
      for (const [, columnsMap] of refsMatrix.current.entries()) {
        for (const [col, { input }] of columnsMap.entries()) {
          if (col === 0 && input && !input.id) {
            // You found a category input without an id
            return input
          }
        }
      }
    }
    // No input without an id found
    return null
  }

  const hanldeYearChange = (year: number) => {
    setYear(year)
  }

  const handleAddRow = (categoryParent: CategoryParent) => {
    console.log("HANDLE ADD ROW @", new Date().toLocaleTimeString())
    const inputWithoutId = findCategoryInputWithoutId()
    console.log(`\tinputWithoutId:`, inputWithoutId)
    if (findCategoryInputWithoutId()) return // prevents duplicating row when input value is not empty for new category name and add row is clicked
    setCategoryData((prev) => {
      const newCategory = {
        userId,
        id: "",
        name: "",
        parent: categoryParent,
      }
      return prev ? [...prev, newCategory] : [newCategory]
    })
    console.log(`\tcategoryData:`, categoryData)
  }

  const handleCategoryFocusOut = async (
    e: React.FocusEvent<HTMLInputElement>,
  ) => {
    console.log("HANDLE CATEGORY FOCUS OUT @", new Date().toLocaleTimeString())
    const input = e.target
    const row = parseInt(input.dataset.row!)
    const col = parseInt(input.dataset.col!)
    const category = refsMatrix.current!.get(row)!.get(col)!.category! // will always exist, assigned to map in render
    const newCategoryName = input.value.trim()
    const oldCategoryName = category.name

    // If the category name is empty, delete the category
    if (newCategoryName === "") {
      console.log("DELETE CATEGORY")
      setCategoryData((prev) => {
        return prev!.filter((c) => c.id !== category.id)
      })
      return
    }

    // If the category name is unchanged, do nothing
    if (newCategoryName === oldCategoryName) {
      return
    }

    // If the category id is empty, insert a new category
    if (category.id === "") {
      try {
        const { success, id } = await actions.insertCategory({
          userId,
          name: newCategoryName,
          parent: category.parent,
        })

        if (success && id) {
          addLog(
            `[${new Date().toLocaleTimeString()}] Inserted category "${newCategoryName}"`,
          )
          setCategoryData((prev) => {
            if (!prev) return null
            return prev.map((c) => {
              if (c.id === category.id) {
                return { ...c, id, name: newCategoryName }
              } else {
                return c
              }
            })
          })
        } else {
          setCategoryData((prev) => {
            return prev!.filter((c) => c.id !== category.id)
          })
          throw new Error("Failed to insert category")
        }
      } catch (err) {
        console.error(err)
        addLog(
          `[${new Date().toLocaleTimeString()}] Error: Failed to insert category "${newCategoryName}"`,
        )
      }
    }
  }

  const handleAmountFocusOut = async (
    e: React.FocusEvent<HTMLInputElement>,
  ) => {
    console.log("HANDLE AMOUNT FOCUS OUT @", new Date().toLocaleTimeString())
    const input = e.target
    const row = parseInt(input.dataset.row!)
    const col = parseInt(input.dataset.col!)
    const category = refsMatrix.current!.get(row)!.get(col)!
      .category! as IExtendedCategory // will always exist, assigned to map in render
    const newAmount = parseInt((parseFloat(input.value) * 100).toFixed(0)) // convert dollars to cents
    const oldAmount = yearData?.amounts
      .find((amount) => amount.categories.find((c) => c.id === category.id))
      ?.categories.find((c) => c.id === category.id)?.monthlyAmounts[col - 1]
      ?.amount

    console.log(newAmount, oldAmount)

    // If the amount is empty or 0, delete the amount
    if (newAmount === 0) {
      return
    }

    // If the amount is unchanged, do nothing
    if (newAmount === oldAmount) {
      return
    }

    // If the amount has no id, insert a new amount
    if (!input.id) {
      try {
        const { success, id } = await actions.insertAmount({
          userId,
          amount: newAmount,
          year,
          month: col,
          categoryId: category.id,
        })

        if (success && id) {
          addLog(
            `[${new Date().toLocaleTimeString()}] Set the amount to ${formatCurrency(
              newAmount / 100,
            )} in ${new Date(2023, col - 1, 1).toLocaleString("default", {
              month: "short",
            })} for the "${category.name}" category`,
          )
          setYearData((prev) => {
            if (!prev) return null
            e.target.id = id // Set input id to the id of the amount
            const updatedAmounts = prev.amounts.map((amount) =>
              amount.parent === category.parent
                ? {
                    ...amount,
                    categories: amount.categories.map((c) =>
                      c.id === category.id
                        ? {
                            ...c,
                            monthlyAmounts: [
                              ...c.monthlyAmounts,
                              {
                                id,
                                amount: newAmount,
                              },
                            ],
                          }
                        : c,
                    ),
                  }
                : amount,
            )
            return {
              ...prev,
              amounts: updatedAmounts,
            }
          })
        } else {
          throw new Error("Failed to insert amount")
        }
      } catch (err) {
        console.error(err)
        addLog(
          `[${new Date().toLocaleTimeString()}] Error: Failed to set the amount to ${formatCurrency(
            newAmount / 100,
          )} in ${new Date(2023, col - 1, 1).toLocaleString("default", {
            month: "short",
          })} for the "${category.name}" category`,
        )
      }
    }
  }

  const getMap = () => {
    if (!refsMatrix.current) {
      refsMatrix.current = new Map<number, Map<number, ICategoryRef>>()
    }
    return refsMatrix.current
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    row: number,
    col: number,
  ) => {
    // TODO: ignore shift + enter on mobile
    if (e.shiftKey && e.key === "Enter") {
      /**
       * If shift + enter, move focus upwards
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
    } else if (e.key === "Enter") {
      /**
       * If enter, move focus downwards
       */
      e.preventDefault()
      e.stopPropagation()
      // If we're on the last row
      if (row === totalRowIndex - 1) {
        // If we're on the last column, blur the input
        if (col === 12) {
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
    } else if (e.shiftKey && e.key === "Tab") {
      /**
       * If shift + tab, move focus to the previous input
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
        // Move focus to the last input of the previous row
        refsMatrix.current
          ?.get(row - 1)
          ?.get(12)
          ?.input?.focus()
        return
      }
      // Move focus to the previous input
      refsMatrix.current
        ?.get(row)
        ?.get(col - 1)
        ?.input?.focus()
    } else if (e.key === "Tab") {
      /**
       * If tab, move focus to the next input
       */
      e.preventDefault()
      e.stopPropagation()
      // If we're on the last column
      if (col === 12) {
        // If we're on the last row, blur the input
        if (row === totalRowIndex - 1) {
          refsMatrix.current?.get(row)?.get(col)?.input?.blur()
          return
        }
        // Move focus to the first input of the next row
        refsMatrix.current
          ?.get(row + 1)
          ?.get(0)
          ?.input?.focus()
        return
      }
      // Move focus to the next input
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

  return (
    <>
      {console.log("RENDER @", new Date().toLocaleTimeString())}
      {console.log(`\tcategoryData:`, categoryData)}
      {console.log(`\trefsMatrix:`, refsMatrix.current)}
      {console.log(`\tyearData:`, yearData)}

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
                            <tr key={row}>
                              <td className="sticky left-0 z-20 border-b border-r bg-white p-0">
                                <MyInput
                                  id={category.id}
                                  key={category.id}
                                  myValue={category.name}
                                  data-row={row}
                                  data-col={0}
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
                                  onBlur={(e) => handleCategoryFocusOut(e)}
                                />
                              </td>
                              {Array.from({ length: 12 }).map((_, col) => (
                                <td
                                  key={`${row}-${col}`}
                                  className={cn(
                                    "relative h-6 border-b border-r p-0",
                                    col === 11 && "border-r-0",
                                  )}
                                >
                                  <MyInput
                                    key={`new-amount-${row}-${col}`}
                                    type="number"
                                    step={"0.01"}
                                    myValue={0}
                                    data-row={row}
                                    data-col={col + 1}
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
                                    onFocusOut={(e) => handleAmountFocusOut(e)}
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
                                  data-row={row}
                                  data-col={0}
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
                                  onBlur={(e) => handleCategoryFocusOut(e)}
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
                                    id={amount.id ?? ""}
                                    key={`${amount.id}`}
                                    type="number"
                                    step={"0.01"}
                                    myValue={amount.amount / 100} // convert cents to dollars
                                    data-row={row}
                                    data-col={col + 1}
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
                                    onFocusOut={(e) => handleAmountFocusOut(e)}
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
                      className="sticky left-0 z-10 h-6 border-b bg-white pl-3 text-base text-zinc-400 transition hover:cursor-pointer hover:bg-white hover:text-zinc-900 mobile:text-sm"
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
