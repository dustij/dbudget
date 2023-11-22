"use client"

import React, { useCallback, type FC, useState, useEffect, useRef } from "react"
import { cn, toTitleCase } from "~/lib/utils"
import YearPicker from "../year-picker"
import { IoAddCircleOutline } from "react-icons/io5"
import { CATEGORY_PARENTS } from "~/lib/constants"
import { MyInput } from "../my-input"
import { parse } from "path"

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
  // TODO: should I optimistically update the UI? https://react.dev/reference/react/useOptimistic#noun-labs-1201738-(2)
  const [year, setYear] = useState<number>(2023)
  const [yearData, setYearData] = useState<IYearData | null>(
    budget.yearData.find((data) => data.year === year) || null,
  )
  const [categoryData, setCategoryData] = useState<ICategory[] | null>(
    budget.categories || null,
  )
  const refsMatrix = useRef<Map<number, Map<number, ICategoryRef>> | null>(null)

  let totalRowIndex = 0 // track row index across different parents

  useEffect(() => {
    console.log(
      "\nuseEffect()",
      `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
    )
    console.log("\tuseEffect() -> categoryData:", categoryData)
    // find ICategoryRef with id 'new-category' and focus on it
    const newCategoryRef = Array.from(refsMatrix.current?.values() || [])
      .flat()
      .find((ref) => ref.values().next().value.category.id === "new-category")

    console.log(
      "\tuseEffect() -> refsMatrix.current number of rows",
      refsMatrix.current?.size,
    )
    console.log("\tuseEffect() -> newCategoryRef:", newCategoryRef)
    newCategoryRef?.get(0)?.input?.focus()
  }, [categoryData])

  const hanldeYearChange = useCallback((year: number) => {
    setYear(year)
  }, [])

  const handleAddRow = (categoryParent: CategoryParent) => {
    console.log(
      "\nhandleAddRow()",
      `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
    )
    // Check if a new category already exists
    const isNewCategoryPresent = categoryData?.some(
      (category) => category.id === "new-category",
    )

    // Prevent adding a new row if a new category is already present
    if (isNewCategoryPresent) {
      console.log("\thandleAddRow() -> new category already present")
      return
    }

    const newCategory: ICategory = {
      id: "new-category",
      userId,
      name: "",
      parent: categoryParent,
    } // FIXME: if focus is on new-category input, and add row is clicked, new row will copy the value of new-category input

    setCategoryData((prev) => {
      console.log(
        "\thandleAddRow() -> setCategoryData() -> new category id:",
        newCategory.id,
      )
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

  const handleFocusOut = (e: React.FocusEvent<HTMLInputElement>) => {
    console.log(
      "\nhandleFocusOut()",
      `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
    )
    console.log("\thandleFocusOut() -> e.target.id:", e.target.id)

    if (e.target.id === "new-category") {
      handleNewCategoryFocusOut(e)
    } else if (e.target.id.startsWith("new-amount")) {
      handleNewAmountFocusOut(e)
    }
  }

  const handleNewCategoryFocusOut = async (
    e: React.FocusEvent<HTMLInputElement>,
  ) => {
    const newCategoryName = e.target.value.trim()
    if (!newCategoryName) {
      console.log("\thandleNewCategoryFocusOut() -> no new category name")
      console.log("\thandleNewCategoryFocusOut() -> setCategoryData()")
      setCategoryData((prev) =>
        prev ? prev.filter((c) => c.id !== "new-category") : null,
      )
      return
    }

    try {
      const { success, id } = await actions.insertCategory({
        userId,
        name: newCategoryName,
        parent: e.target.dataset.parent as CategoryParent,
      })

      if (success && id) {
        setCategoryData((prev) => {
          console.log(
            "\thandleNewCategoryFocusOut() -> setCategoryData() -> new category id:",
            id,
          )
          if (!prev) return null
          return prev.map((c) =>
            c.id === "new-category" ? { ...c, id, name: newCategoryName } : c,
          )
        })
      } else {
        console.error(`! Error inserting category: ${newCategoryName}`)
        alert(
          `Error inserting category: ${newCategoryName} (replace with a toast)`,
        )
        console.log("\thandleNewCategoryFocusOut() -> setCategoryData()")
        setCategoryData((prev) =>
          prev ? prev.filter((c) => c.id !== "new-category") : null,
        )
      }
    } catch (error) {
      console.error("! Error inserting category:", error)
      alert("Error inserting category (replace with a toast)")
    }
  }

  const handleNewAmountFocusOut = async (
    e: React.FocusEvent<HTMLInputElement>,
  ) => {
    const newAmount = e.target.value.trim()
    if (!newAmount || parseFloat(newAmount) === 0) {
      return
    }

    const categoryId = e.target.dataset.categoryId
    const categoryName = e.target.dataset.categoryName
    const month = e.target.dataset.month
    const parent = e.target.dataset.parent as CategoryParent

    if (!categoryId || !categoryName || !month || !parent) {
      console.error(
        `! Error inserting amount: ${newAmount} (missing data attributes)`,
      )
      alert(`Error inserting amount: ${newAmount} (replace with a toast)`)
      return
    }

    const amountInCents = parseFloat(newAmount) * 100

    try {
      const { success, id } = await actions.insertAmount({
        userId,
        amount: amountInCents,
        year,
        month,
        categoryId,
      })

      if (success && id) {
        setYearData((prev) => {
          if (!prev) return null
          e.target.id = id // Set input id to the id of the amount
          const updatedAmounts = prev.amounts.map((amount) =>
            amount.parent === parent
              ? {
                  ...amount,
                  categories: amount.categories.map((category) =>
                    category.id === categoryId
                      ? {
                          ...category,
                          monthlyAmounts: [
                            ...category.monthlyAmounts,
                            {
                              id,
                              amount: amountInCents,
                            },
                          ],
                        }
                      : category,
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
        console.error(`! Error inserting amount: ${newAmount}`)
        alert(`Error inserting amount: ${newAmount} (replace with a toast)`)
      }
    } catch (error) {
      console.error("! Error inserting amount:", error)
      alert("Error inserting amount (replace with a toast)")
    }
  }

  const getMap = () => {
    if (!refsMatrix.current) {
      refsMatrix.current = new Map<number, Map<number, ICategoryRef>>()
    }
    return refsMatrix.current
  }

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
                            <tr key={row}>
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
                                  onBlur={(e) => handleFocusOut(e)}
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
                                    id={`new-amount-${row}-${col}`}
                                    key={`new-amount-${row}-${col}`}
                                    type="number"
                                    step={"0.01"}
                                    myValue={0}
                                    data-parent={category.parent}
                                    data-category-id={category.id}
                                    data-category-name={category.name}
                                    data-month={col + 1}
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
                                    onFocusOut={(e) => handleFocusOut(e)}
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
                                  onBlur={(e) => handleFocusOut(e)}
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
                                    id={
                                      amount.id
                                        ? `${amount.id}`
                                        : `new-amount-${row}-${col}`
                                    }
                                    key={`${amount.id}`}
                                    type="number"
                                    step={"0.01"}
                                    myValue={amount.amount / 100} // convert cents to dollars
                                    data-parent={category.parent}
                                    data-category-id={category.id}
                                    data-category-name={category.name}
                                    data-month={col + 1}
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
                                    onFocusOut={(e) => handleFocusOut(e)}
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
