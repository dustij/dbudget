"use client"

import React, { type FC, useState, useEffect, useRef } from "react"
import YearPicker from "../year-picker"
import { IoAddCircleOutline } from "react-icons/io5"
import { CATEGORY_PARENTS } from "~/lib/constants"
import { cn, toTitleCase } from "~/lib/utils"
import { MyInput } from "../my-input"
import { Button } from "../ui/button"
import { categories } from "~/db/schema"

interface RefItem {
  input: HTMLInputElement
  category: ICategory
}

interface BudgetTableClientProps {
  userId: string
  data: IBudgetData
  action: {
    getBudget: () => Promise<IBudgetData>
  }
}

const BudgetTableClient: FC<BudgetTableClientProps> = ({
  userId,
  data,
  action,
}) => {
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [budget, setBudget] = useState<IBudgetData>(data)
  const [isDirty, setIsDirty] = useState<boolean>(false)
  const refsMatrix = useRef<RefItem[][]>([])
  const lastSave = useRef<number>(new Date().getTime())

  let totalRowIndex = 0 // track row index across different parents

  useEffect(() => {
    console.debug(refsMatrix.current)
  }, [refsMatrix])

  useEffect(() => {
    console.debug(budget)

    const emptyInput = refsMatrix.current.find((row) =>
      row.find((col) => col.category.id === "~!"),
    )?.[0]?.input

    if (emptyInput) {
      emptyInput.focus()
    }
  }, [budget])

  const hanldeYearChange = (year: number) => {
    setYear(year)
  }

  const handleAddRow = (parent: CategoryParent) => {
    const newCategory: ICategory = {
      id: "~!",
      name: "",
      userId: userId,
      parent: parent,
    }
    setBudget((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }))
  }

  const handleCancel = async () => {
    const data = await action.getBudget()
    setBudget(data)
    setIsDirty(false)
    lastSave.current = new Date().getTime()
  }

  const handleCategoryOut = (
    e: React.FocusEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<string | number>>,
  ) => {
    const previousValue = e.target.dataset.previousValue?.trim()
    const currentValue = e.target.value.trim()

    // If the values are equal, check if they are empty strings
    if (currentValue === previousValue) {
      // If not then do nothing, because no change was made
      if (currentValue !== "") return
      // If both are empty strings, remove the row from the budget because there is nothing to save
      const filteredCategories = budget.categories.filter((c) => c.name !== "")
      setBudget((prev) => ({
        ...prev,
        categories: filteredCategories,
      }))
      return
    }

    setIsDirty(true)
  }

  const handleAmountOut = (
    e: React.FocusEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<string | number>>,
  ) => {
    const previousValue = e.target.dataset.previousValue?.trim()
    const currentValue = e.target.value.trim()

    // If the values are equal then do nothing, because no change was made
    if (currentValue === previousValue) return
    // If previous value is 0 and current value is empty string, do nothing
    if (previousValue === "0.00" && currentValue === "") return

    setIsDirty(true)
  }

  const getMonthAmount = (category: ICategory, month: number): number => {
    // Is there a data for this year?
    const yearData = budget.allYearsData.find((d) => d.year === year)
    if (!yearData) return 0
    // Is there a budget for this parent?
    const parentBudget = yearData.budgets.find(
      (b) => b.parent === category.parent,
    )
    if (!parentBudget) return 0
    // Is this category in the budget?
    const categoryBudget = parentBudget.categoriesData.find(
      (c) => c.id === category.id,
    )
    if (!categoryBudget) return 0
    // Get the amount for this month
    const amountData = categoryBudget.monthlyAmounts[month]
    if (!amountData) return 0
    // convert from cents to dollars
    return amountData.amount / 100
  }

  return (
    <>
      <div
        className={
          "sticky left-0 top-0 z-30 flex h-[48px] items-center justify-between gap-2 border-b bg-white px-4"
        }
      >
        <YearPicker onYearChange={hanldeYearChange}>{year}</YearPicker>
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            className="h-8 font-normal focus-visible:border-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime-500"
            disabled={!isDirty}
          >
            Save
          </Button>
          <Button
            variant="outline"
            className="h-8 font-normal text-zinc-600 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime-500"
            disabled={!isDirty}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
      <div className="relative">
        <table
          className={
            "w-full min-w-[1070px] table-fixed border-separate border-spacing-0 bg-white text-[14px]"
          }
        >
          <thead className="sticky top-[48px] z-30 h-[33px] bg-white">
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
            {CATEGORY_PARENTS.map((parent) => (
              <React.Fragment key={parent}>
                {/* Parent Totals Row */}
                <tr key={parent}>
                  <td className="sticky left-0 cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r bg-white px-1.5 text-left text-base font-normal text-zinc-900 mobile:text-sm">
                    {toTitleCase(parent)}
                  </td>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <td
                      key={i}
                      className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r bg-white px-1.5 text-right text-base font-normal text-zinc-900 mobile:text-sm"
                    >
                      0.00
                    </td>
                  ))}
                </tr>

                {/* Child Rows */}
                {budget.categories
                  .filter((c) => c.parent === parent)
                  .map((category) => {
                    const row = totalRowIndex++
                    return (
                      <tr key={row} className="group">
                        <td className="sticky left-0 z-10 cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r bg-white px-2 text-left text-base font-normal text-zinc-500 group-hover:bg-accent mobile:text-sm">
                          <MyInput
                            key={`${category.name}-${lastSave.current}`}
                            id={category.id}
                            name={category.name}
                            data-previous-value=""
                            autoComplete="off"
                            className="w-full text-zinc-500"
                            value={category.name}
                            ref={(input) => {
                              if (input) {
                                const currentRow = refsMatrix.current[row] || []
                                currentRow[0] = { input, category }
                                refsMatrix.current[row] = currentRow
                              }
                            }}
                            onFocus={(e) => {
                              e.target.dataset.previousValue = e.target.value
                            }}
                            onFocusOut={({ e, setValue }) =>
                              handleCategoryOut(e, setValue)
                            }
                          />
                        </td>

                        {Array.from({ length: 12 }).map((_, col) => (
                          <td
                            key={col}
                            className={cn(
                              "relative h-6 border-b border-r p-0 group-hover:bg-accent",
                              col === 11 && "border-r-0",
                            )}
                          >
                            <MyInput
                              key={`${category.name}-${col}-${lastSave.current}`}
                              name={`${category.name}-${col}`}
                              className="w-full text-zinc-500"
                              type="number"
                              value={getMonthAmount(category, col)}
                              data-previous-value=""
                              ref={(input) => {
                                if (input) {
                                  const currentRow =
                                    refsMatrix.current[row] || []
                                  currentRow[col + 1] = { input, category }
                                  refsMatrix.current[row] = currentRow
                                }
                              }}
                              onFocus={(e) => {
                                e.target.dataset.previousValue = e.target.value
                              }}
                              onFocusOut={({ e, setValue }) =>
                                handleAmountOut(e, setValue)
                              }
                            />
                          </td>
                        ))}
                      </tr>
                    )
                  })}

                {/* Add Button Row */}
                <tr key={`${parent}-add`}>
                  <td
                    className="sticky left-0 z-10 h-6 border-b bg-white pl-3 text-base text-zinc-400 transition hover:cursor-pointer hover:bg-white hover:text-zinc-900 mobile:text-sm"
                    onClick={() => handleAddRow(parent)}
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
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default BudgetTableClient
