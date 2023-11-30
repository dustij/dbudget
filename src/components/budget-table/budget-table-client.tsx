"use client"

import React, { type FC, useState, useEffect, useRef } from "react"
import YearPicker from "../year-picker"
import { IoAddCircleOutline } from "react-icons/io5"
import { cn, formatCurrency, toTitleCase } from "~/lib/utils"
import { MyInput } from "../my-input"
import { Button } from "../ui/button"
import { get } from "http"

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

  const getParentTotal = (parent: CategoryParent, month: number): number => {
    const yearData = budget.allYearsData.find((d) => d.year === year)
    if (!yearData) return 0
    const parentBudget = yearData.budgets.find((b) => b.parent === parent)
    if (!parentBudget) return 0
    const categoriesData = parentBudget.categoriesData
    if (!categoriesData) return 0

    const total = categoriesData.reduce((acc, curr) => {
      const amountData = curr.monthlyAmounts[month]
      if (!amountData) return acc
      return acc + amountData.amount / 100
    }, 0)

    return total
  }

  const parentsRef = useRef<{ name: CategoryParent; totals: number[] }[]>([
    {
      name: "income",
      totals: Array.from({ length: 12 }, (_, i) => getParentTotal("income", i)),
    },
    {
      name: "fixed",
      totals: Array.from({ length: 12 }, (_, i) => getParentTotal("fixed", i)),
    },
    {
      name: "variable",
      totals: Array.from({ length: 12 }, (_, i) =>
        getParentTotal("variable", i),
      ),
    },
    {
      name: "discretionary",
      totals: Array.from({ length: 12 }, (_, i) =>
        getParentTotal("discretionary", i),
      ),
    },
    {
      name: "obligation",
      totals: Array.from({ length: 12 }, (_, i) =>
        getParentTotal("obligation", i),
      ),
    },
    {
      name: "leakage",
      totals: Array.from({ length: 12 }, (_, i) =>
        getParentTotal("leakage", i),
      ),
    },
    {
      name: "savings",
      totals: Array.from({ length: 12 }, (_, i) =>
        getParentTotal("savings", i),
      ),
    },
  ])

  let totalRowIndex = 0 // track row index across different parents

  useEffect(() => {
    console.debug(refsMatrix.current)
  }, [refsMatrix])

  useEffect(() => {
    console.debug(budget)

    const emptyInput = refsMatrix.current.find((row) =>
      row.find((col) => col.category.id === "@just-added!"),
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
      id: "@just-added!",
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
    parent: CategoryParent,
  ) => {
    const previousValue = e.target.dataset.previousValue?.trim()
    const currentValue = e.target.value.trim()

    console.log("previousValue", previousValue, "currentValue", currentValue)

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

    // Category names should be unique
    const categoryExists = budget.categories.find(
      (c) => c.name === currentValue,
    )

    // Update th budget
    setIsDirty(true)

    /* If previous value is empty string and current value is not empty string, this is a new category.
      Add the new category to the categories array in the budget and create a new IExtendedCategory item and add it to the
      categoriesData array for the selected year, with the 0 amount in monthlyAmounts for all months, remember the id is "@just-added!"
      so replace that empty category with a new one
    */
    if (previousValue === "" && currentValue !== "") {
      // If the category already exists, remove the row, cannot add new category with same name
      if (categoryExists) {
        const filteredCategories = budget.categories.filter(
          (c) => c.id !== "@just-added!",
        )
        setBudget((prev) => ({
          ...prev,
          categories: filteredCategories,
        }))
        return
      }

      const newCategory: ICategory = {
        id: "",
        name: currentValue,
        userId: userId,
        parent: parent,
      }

      const yearData = budget.allYearsData.find((d) => d.year === year) ?? {
        year: year,
        budgets: [],
      }

      const categoriesData =
        yearData.budgets.find((b) => b.parent === parent)?.categoriesData ?? []

      setBudget((prev) => ({
        categories: prev.categories.map((c) => {
          if (c.id !== "@just-added!") return c
          return newCategory
        }),
        allYearsData: [
          ...prev.allYearsData,
          {
            year: year,
            budgets: [
              ...yearData.budgets,
              {
                parent: parent,
                categoriesData: [
                  ...categoriesData,
                  {
                    ...newCategory,
                    monthlyAmounts: Array.from({ length: 12 }, () => ({
                      id: null,
                      amount: 0,
                    })),
                  },
                ],
              },
            ],
          },
        ],
      }))
    }
  }

  const handleAmountOut = (
    e: React.FocusEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<string | number>>,
    { row, col }: { row: number; col: number },
    category: ICategory,
  ) => {
    const previousValue = e.target.dataset.previousValue?.trim()
    const currentValue = e.target.value.trim()

    // If the values are equal then do nothing, because no change was made
    if (currentValue === previousValue) return
    // If previous value is 0 and current value is empty string, do nothing
    if (previousValue === "0.00" && currentValue === "") return

    // Update the budget
    setIsDirty(true)

    // If the previous value was 0 and the current value is not empty
    if (previousValue === "0.00" && currentValue !== "") {
      setBudget((prev) => ({
        ...prev,
        allYearsData: prev.allYearsData.map((yearData) => {
          if (yearData.year !== year) return yearData

          return {
            ...yearData,
            budgets: yearData.budgets.map((b) => {
              if (b.parent !== category.parent) return b

              return {
                parent: b.parent,
                categoriesData: b.categoriesData.map((c) => {
                  if (c.name !== category.name) return c

                  return {
                    ...c,
                    monthlyAmounts: [
                      ...c.monthlyAmounts.slice(0, col),
                      {
                        id: null,
                        amount: parseInt(currentValue) * 100,
                      },
                      ...c.monthlyAmounts.slice(col + 1),
                    ],
                  }
                }),
              }
            }),
          }
        }),
      }))
    }
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
            {parentsRef.current.map((parent) => (
              <React.Fragment key={parent.name}>
                {/* Parent Totals Row */}
                <tr key={parent.name}>
                  <td className="sticky left-0 cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r bg-white px-1.5 text-left text-base font-normal text-zinc-900 mobile:text-sm">
                    {toTitleCase(parent.name)}
                  </td>
                  {Array.from({ length: 12 }).map((_, col) => (
                    <td
                      key={`${parent}-${col}-${lastSave.current}`}
                      className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r bg-white px-1.5 text-right text-base font-normal text-zinc-900 mobile:text-sm"
                    >
                      {formatCurrency(parent.totals[col] ?? 0)}
                    </td>
                  ))}
                </tr>

                {/* Child Rows */}
                {budget.categories
                  .filter((c) => c.parent === parent.name)
                  .map((category) => {
                    const row = totalRowIndex++
                    return (
                      <tr key={row} className="group">
                        <td className="sticky left-0 z-10 cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r bg-white px-2 text-left text-base font-normal text-zinc-500 group-hover:bg-accent mobile:text-sm">
                          <MyInput
                            key={`${category.name}-${lastSave.current}`}
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
                              handleCategoryOut(e, setValue, parent.name)
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
                                handleAmountOut(
                                  e,
                                  setValue,
                                  { row, col },
                                  category,
                                )
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
                    onClick={() => handleAddRow(parent.name)}
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
