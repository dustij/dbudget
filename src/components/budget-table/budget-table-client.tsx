"use client"

import React, { type FC, useState, useEffect, useRef } from "react"
import { cn, formatCurrency, toTitleCase } from "~/lib/utils"
import YearPicker from "../year-picker"
import { IoAddCircleOutline } from "react-icons/io5"
import { CATEGORY_PARENTS } from "~/lib/constants"
import { MyInput } from "../my-input"
import { useLogContext } from "~/context/log-context"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { set } from "zod"
import { Button } from "../ui/button"

//  FIXME: Forseeable issues:
/*
  - When adding a new category, if the response delay is longer than it takes for the user to enter amounts,
  the amounts will be added without a category id associated with them, then when the category id is returned,
  the row will be 0 amounts, and the database will have stale amounts with no category id associated with them.

  - When deleting a category, if the response delay is longer than it takes for the user to enter amounts,
  the amounts will be added without a category id associated with them, then when the category is deleted,
  the database will have stale amounts with a category id associated with them, but no category in the categories 
  table with that id.

  To work around these issues, I added a waiting dialog that shows when the user tries to interact with the table
  while waiting for a response from the server. This prevents the user from adding new rows or entering amounts while
  still trying to maintain responsiveness where possible. The waiting dialog is only shown if the user tries to interact
  with a row that has no category id, or if the user tries to interact with a row while a category is being deleted.
*/

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
    updateAmount: (
      amountId: string,
      newAmount: number | string,
    ) => Promise<{ success: boolean }>
    deleteAmount: (amountId: string) => Promise<{ success: boolean }>
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
    updateCategory: (
      categoryId: string,
      newName: string,
    ) => Promise<{ success: boolean }>
    deleteCategory: (categoryId: string) => Promise<{ success: boolean }>
    revalidateBudget: (userId: string) => Promise<IBudget>
  }
}

const BudgetTableClient: FC<BudgetTableClientProps> = ({
  userId,
  budget,
  actions,
}) => {
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [yearData, setYearData] = useState<IYearData | null>(
    budget.yearData.find((data) => data.year === year) || null,
  )
  const [categoryData, setCategoryData] = useState<ICategory[] | null>(
    budget.categories || null,
  )
  const refsMatrix = useRef<Map<number, Map<number, ICategoryRef>> | null>(null)
  const [isWaitingForResponse, setIsWaitingForResponse] =
    useState<boolean>(false)
  const [showWaitingDialog, setShowWaitingDialog] = useState<boolean>(false)
  const [showDeleteCategoryDialog, setShowDeleteCategoryDialog] =
    useState<boolean>(false)
  const [categoryToDelete, setCategoryToDelete] = useState<ICategory | null>(
    null,
  )
  const [isDeletingCategory, setIsDeletingCategory] = useState<boolean>(false)
  const { addLog } = useLogContext()

  let totalRowIndex = 0 // track row index across different parents

  useEffect(() => {
    actions.revalidateBudget(userId).then((budget) => {
      setYearData(budget.yearData.find((data) => data.year === year) || null)
      setCategoryData(budget.categories || null)
    })
  }, [year, budget.yearData, budget.categories, actions, userId])

  useEffect(() => {
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
    const inputWithoutId = findCategoryInputWithoutId()
    if (findCategoryInputWithoutId()) {
      // prevents duplicating row when input value is not empty for new category name and add row is clicked
      setShowWaitingDialog(true)
      return
    }
    setCategoryData((prev) => {
      const newCategory = {
        userId,
        id: "",
        name: "",
        parent: categoryParent,
      }
      return prev ? [...prev, newCategory] : [newCategory]
    })
  }

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return

    addLog(
      `[${new Date().toLocaleTimeString()}] Deleting category "${
        categoryToDelete.name
      }"...`,
    )

    try {
      setIsDeletingCategory(true)
      setIsWaitingForResponse(true)
      // Not showing waiting dailog right away, only show if user trys to interact with this row (see handleKeyDown)

      const { success } = await actions.deleteCategory(categoryToDelete.id)

      setIsWaitingForResponse(false)
      setShowWaitingDialog(false)
      setIsDeletingCategory(false)

      if (success) {
        addLog(
          `[${new Date().toLocaleTimeString()}] Success: Deleted category "${
            categoryToDelete.name
          }"`,
        )
        setCategoryData((prev) => {
          return prev!.filter((c) => c.id !== categoryToDelete.id)
        })
      } else {
        throw new Error("Failed to delete category")
      }
    } catch (err) {
      console.error(err)
      addLog(
        `[${new Date().toLocaleTimeString()}] Error: Failed to delete category "${
          categoryToDelete.name
        }"`,
      )
    } finally {
      setShowDeleteCategoryDialog(false)
      setCategoryToDelete(null)
    }
  }

  const handleCategoryFocusOut = async (
    e: React.FocusEvent<HTMLInputElement>,
    setValue?: React.Dispatch<React.SetStateAction<string | number>>,
  ) => {
    const input = e.target
    const row = parseInt(input.dataset.row!)
    const col = parseInt(input.dataset.col!)
    const category = refsMatrix.current!.get(row)!.get(col)!.category! // will always exist, assigned to map in render
    const newCategoryName = input.value.trim()
    const oldCategoryName = category.name

    if (newCategoryName === oldCategoryName) {
      // when newly added row is blurred without changing the category name, delete the row, no db call
      if (newCategoryName === "") {
        setCategoryData((prev) => {
          return prev!.filter((c) => c.id !== category.id)
        })
      }
      return
    }

    /**
     * Insert new category
     */
    if (category.id === "") {
      addLog(
        `[${new Date().toLocaleTimeString()}] Creating category "${newCategoryName}"...`,
      )

      try {
        setIsWaitingForResponse(true)
        // Not showing waiting dailog right away, only show if user trys to interact with this row (see handleKeyDown)

        const { success, id } = await actions.insertCategory({
          userId,
          name: newCategoryName,
          parent: category.parent,
        })

        setIsWaitingForResponse(false)
        setShowWaitingDialog(false)

        if (success && id) {
          addLog(
            `[${new Date().toLocaleTimeString()}] Success: Created category "${newCategoryName}"`,
          )
          setCategoryData((prev) => {
            if (!prev) return []
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
          throw new Error("Failed to create category")
        }
      } catch (err) {
        console.error(err)
        addLog(
          `[${new Date().toLocaleTimeString()}] Error: Failed to create category "${newCategoryName}"`,
        )
      }
      return
    }

    /**
     * Delete existing category
     */
    if (newCategoryName === "") {
      if (!showDeleteCategoryDialog) {
        setShowDeleteCategoryDialog(true)
        setCategoryToDelete(category)
      }
      // If delete was cancelled, revert to old category name
      setValue?.(oldCategoryName)

      // addLog(
      //   `[${new Date().toLocaleTimeString()}] Deleting category "${oldCategoryName}"...`,
      // )

      // try {
      //   setIsDeletingCategory(true)
      //   setIsWaitingForResponse(true)
      //   // Not showing waiting dailog right away, only show if user trys to interact with this row (see handleKeyDown)

      //   const { success } = await actions.deleteCategory(category.id)

      //   setIsWaitingForResponse(false)
      //   setShowWaitingDialog(false)
      //   setIsDeletingCategory(false)

      //   if (success) {
      //     addLog(
      //       `[${new Date().toLocaleTimeString()}] Success: Deleted category "${oldCategoryName}"`,
      //     )
      //     setCategoryData((prev) => {
      //       return prev!.filter((c) => c.id !== category.id)
      //     })
      //   } else {
      //     throw new Error("Failed to delete category")
      //   }
      // } catch (err) {
      //   console.error(err)
      //   setValue?.(oldCategoryName)
      //   addLog(
      //     `[${new Date().toLocaleTimeString()}] Error: Failed to delete category "${oldCategoryName}"`,
      //   )
      // }
      return
    }

    /**
     * Update existing category
     */
    addLog(
      `[${new Date().toLocaleTimeString()}] Updating category "${oldCategoryName}" to "${newCategoryName}"...`,
    )

    try {
      setIsWaitingForResponse(true)
      // Not showing waiting dailog right away, only show if user trys to interact with this row (see handleKeyDown)

      const { success } = await actions.updateCategory(
        category.id,
        newCategoryName,
      )

      setIsWaitingForResponse(false)
      setShowWaitingDialog(false)

      if (success) {
        addLog(
          `[${new Date().toLocaleTimeString()}] Success: Updated category "${oldCategoryName}" to "${newCategoryName}"`,
        )
        setCategoryData((prev) => {
          if (!prev) return []
          return prev.map((c) => {
            if (c.id === category.id) {
              return { ...c, name: newCategoryName }
            } else {
              return c
            }
          })
        })
      } else {
        throw new Error("Failed to update category")
      }
    } catch (err) {
      console.error(err)
      setValue?.(oldCategoryName)
      addLog(
        `[${new Date().toLocaleTimeString()}] Error: Failed to update category "${oldCategoryName}" to "${newCategoryName}"`,
      )
    }
  }

  // TODO: feature: take in math statements that start with =, like "= 1000 / 12" or "= 1000 * 0.12" and save the result
  const handleAmountFocusOut = async (
    e: React.FocusEvent<HTMLInputElement>,
    setValue?: React.Dispatch<React.SetStateAction<string | number>>,
  ) => {
    const input = e.target
    const row = parseInt(input.dataset.row!)
    const col = parseInt(input.dataset.col!)
    const category = refsMatrix.current!.get(row)!.get(col)!
      .category! as IExtendedCategory // will always exist, assigned to map in render
    const newAmount = parseInt((parseFloat(input.value) * 100).toFixed(0)) // convert dollars to cents
    const oldAmount = yearData?.amounts
      .find((amount) => amount.categories.find((c) => c.id === category.id))
      ?.categories.find((c) => c.id === category.id)
      ?.monthlyAmounts.find((a) => a.id === input.id)?.amount

    // If the amount is unchanged, do nothing
    if (newAmount === oldAmount) {
      // TODO: doesn't seem to be working, it still updates amounts when they are unchanged
      return
    }

    /**
     * Delete existing amount
     */
    if (!newAmount) {
      if (!input.id) return // If no id, do nothing (amount has not been inserted yet)

      addLog(
        `[${new Date().toLocaleTimeString()}] Deleting the amount in ${new Date(
          year,
          col - 1,
          1,
        ).toLocaleString("default", {
          month: "short",
          year: "2-digit",
        })} for the "${category.name}" category...`,
      )

      try {
        const { success } = await actions.deleteAmount(input.id)

        if (success) {
          addLog(
            `[${new Date().toLocaleTimeString()}] Success: Deleted the amount in ${new Date(
              year,
              col - 1,
              1,
            ).toLocaleString("default", {
              month: "short",
              year: "2-digit",
            })} for the "${category.name}" category`,
          )
          setYearData((prev) => {
            if (!prev) return { year, amounts: [] }
            const updatedAmounts = prev.amounts.map((amount) =>
              amount.parent === category.parent
                ? {
                    ...amount,
                    categories: amount.categories.map((c) =>
                      c.id === category.id
                        ? {
                            ...c,
                            monthlyAmounts: c.monthlyAmounts.map((amount, i) =>
                              i === col - 1
                                ? { ...amount, id: "", amount: 0 }
                                : amount,
                            ),
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
          throw new Error("Failed to delete amount")
        }
      } catch (err) {
        console.error(err)
        addLog(
          `[${new Date().toLocaleTimeString()}] Error: Failed to delete the amount in ${new Date(
            year,
            col - 1,
            1,
          ).toLocaleString("default", {
            month: "short",
            year: "2-digit",
          })} for the "${category.name}" category`,
        )
      }
      return
    }

    /**
     * Insert new amount
     */
    if (!input.id) {
      addLog(
        `[${new Date().toLocaleTimeString()}] Setting the amount in ${new Date(
          year,
          col - 1,
          1,
        ).toLocaleString("default", {
          month: "short",
          year: "2-digit",
        })} for the "${category.name}" category to ${formatCurrency(
          newAmount / 100,
        )}...`,
      )

      try {
        if (isWaitingForResponse) return
        const { success, id } = await actions.insertAmount({
          userId,
          amount: newAmount,
          year,
          month: col,
          categoryId: category.id,
        })

        if (success && id) {
          addLog(
            `[${new Date().toLocaleTimeString()}] Success: Set the amount in ${new Date(
              year,
              col - 1,
              1,
            ).toLocaleString("default", {
              month: "short",
              year: "2-digit",
            })} for the "${category.name}" category to ${formatCurrency(
              newAmount / 100,
            )}`,
          )
          setYearData((prev) => {
            if (!prev)
              // If no year data, return new year data, to be updated later
              return {
                year,
                amounts: [
                  {
                    parent: category.parent,
                    categories: [
                      {
                        ...category,
                        monthlyAmounts: [
                          ...Array.from({ length: 12 }).map((_, i) => ({
                            id: i === col - 1 ? id : "",
                            amount: i === col - 1 ? newAmount : 0,
                          })),
                        ],
                      },
                    ],
                  },
                ],
              }
            e.target.id = id // Set input id to the id of the amount
            const updatedAmounts = prev.amounts.map((amount) =>
              amount.parent === category.parent
                ? {
                    ...amount,
                    categories: amount.categories.map((c) =>
                      c.id === category.id
                        ? {
                            ...c,
                            // set monthly amount at col - 1 to the new amount
                            monthlyAmounts: c.monthlyAmounts.map((amount, i) =>
                              i === col - 1
                                ? { ...amount, id, amount: newAmount }
                                : amount,
                            ),
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
          `[${new Date().toLocaleTimeString()}] Error: Failed to set the amount in ${new Date(
            year,
            col - 1,
            1,
          ).toLocaleString("default", {
            month: "short",
            year: "2-digit",
          })} for the "${category.name}" category to ${formatCurrency(
            newAmount / 100,
          )}`,
        )
      }
      return
    }

    /**
     * Update existing amount
     */
    addLog(
      `[${new Date().toLocaleTimeString()}] Updating the amount in ${new Date(
        year,
        col - 1,
        1,
      ).toLocaleString("default", {
        month: "short",
        year: "2-digit",
      })} for the "${category.name}" category to ${formatCurrency(
        newAmount / 100,
      )}...`,
    )

    try {
      const { success } = await actions.updateAmount(input.id, newAmount)

      if (success) {
        addLog(
          `[${new Date().toLocaleTimeString()}] Success: Updated the amount in ${new Date(
            year,
            col - 1,
            1,
          ).toLocaleString("default", {
            month: "short",
            year: "2-digit",
          })} for the "${category.name}" category to ${formatCurrency(
            newAmount / 100,
          )}`,
        )
        setYearData((prev) => {
          const updatedAmounts = prev!.amounts.map((amount) =>
            amount.parent === category.parent
              ? {
                  ...amount,
                  categories: amount.categories.map((c) =>
                    c.id === category.id
                      ? {
                          ...c,
                          // set monthly amount at col - 1 to the new amount
                          monthlyAmounts: c.monthlyAmounts.map((amount, i) =>
                            i === col - 1
                              ? { ...amount, amount: newAmount }
                              : amount,
                          ),
                        }
                      : c,
                  ),
                }
              : amount,
          )
          return {
            ...prev!,
            amounts: updatedAmounts,
          }
        })
      } else {
        throw new Error("Failed to update amount")
      }
    } catch (err) {
      console.error(err)
      setValue?.(formatCurrency(oldAmount ? oldAmount / 100 : 0, false))
      addLog(
        `[${new Date().toLocaleTimeString()}] Error: Failed to update the amount in ${new Date(
          year,
          col - 1,
          1,
        ).toLocaleString("default", {
          month: "short",
          year: "2-digit",
        })} for the "${category.name}" category to ${formatCurrency(
          newAmount / 100,
        )}`,
      )
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
    if (isWaitingForResponse) {
      // User is trying to interact with the table while waiting for a response
      // If no category id, show waiting dialog
      const categoryId = refsMatrix.current!.get(row)!.get(col)!.category!.id // will always exist, assigned to map in render
      if (!categoryId || isDeletingCategory) {
        setShowWaitingDialog(true)
        return
      }
    }
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
                                  onFocusOut={({ e, setValue }) =>
                                    handleCategoryFocusOut(e, setValue)
                                  }
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
                                    onFocusOut={({ e, setValue }) =>
                                      handleAmountFocusOut(e, setValue)
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
                                  onFocusOut={({ e, setValue }) =>
                                    handleCategoryFocusOut(e, setValue)
                                  }
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
                                    key={amount.id}
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
                                    onFocusOut={({ e, setValue }) =>
                                      handleAmountFocusOut(e, setValue)
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

      {showWaitingDialog && (
        <Dialog open={showWaitingDialog} onOpenChange={setShowWaitingDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Waiting</DialogTitle>
            </DialogHeader>
            <div className="h-full overflow-auto p-2">
              Waiting for a response from the server...
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showDeleteCategoryDialog && (
        <Dialog
          open={showDeleteCategoryDialog}
          onOpenChange={setShowDeleteCategoryDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Category</DialogTitle>
            </DialogHeader>
            <div className="h-full overflow-auto p-2">
              Deleting this category will also delete all amounts associated
              with it. Are you sure you want to delete the category{" "}
              {categoryToDelete?.name}? This action cannot be undone.
            </div>
            <DialogFooter>
              <div className="flex items-center justify-end space-x-2">
                <Button variant="destructive" onClick={handleDeleteCategory}>
                  Delete
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteCategoryDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default BudgetTableClient
