"use client"

import React, { type FC, useState, useEffect, useRef, Suspense } from "react"
import YearPicker from "../year-picker"
import { IoAddCircleOutline } from "react-icons/io5"
import { cn, formatCurrency, toTitleCase } from "~/lib/utils"
import { MyInput } from "../my-input"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"

const parentNames: CategoryParent[] = [
  "income",
  "fixed",
  "variable",
  "discretionary",
  "obligation",
  "leakage",
  "savings",
]

interface RefItem {
  input: HTMLInputElement
  category: ICategory
}

interface BudgetClientProps {
  userId: string
  data: IBudgetData
  action: {
    getServerBudgets: () => Promise<IBudgetData>
    setServerBudgets: (data: IBudgetData) => Promise<IBudgetData>
  }
}

const BudgetClient: FC<BudgetClientProps> = ({ userId, data, action }) => {
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [budgets, setBudgets] = useState<IBudgetData>(data)
  const [isDirty, setIsDirty] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const refsMatrix = useRef<RefItem[][]>([])

  // track row index across different parents
  let totalRowIndex = 0

  useEffect(() => {
    const emptyInput = refsMatrix.current.find((row) =>
      row.find((col) => col.category.id === "@just-added!"),
    )?.[0]?.input

    if (emptyInput) {
      emptyInput.focus()
    }
  }, [budgets])

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
    setBudgets((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    const data = await action.setServerBudgets(budgets)
    setBudgets(data)
    setIsDirty(false)
    setIsSaving(false)
  }

  const handleCancel = async () => {
    const data = await action.getServerBudgets()
    setBudgets(data)
    setIsDirty(false)
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    { row, col }: { row: number; col: number },
  ) => {
    // If the user presses the enter key, move to the next or previous input
    if (e.key === "Enter") {
      const isFirstRow = row === 0
      const isFirstCol = col === 0
      const isLastRow = row === refsMatrix.current.length - 1
      const isLastCol = col === 12

      // If shift key is pressed, move to previous input
      if (e.shiftKey) {
        // If is first row and is first column, we are at the top left corner of the table, so do nothing
        if (isFirstRow && isFirstCol) {
          e.currentTarget.blur()
          return
        }

        // If not first row, move to previous row in same column
        if (!isFirstRow) {
          const previousRow = refsMatrix.current[row - 1]!
          previousRow[col]!.input.focus()
          return
        }

        /* Moving between columns is not supported yet due to the way input keys are generated. May be fixed in the future.
        // If is first row, move to last row in previous column
        const lastRow = refsMatrix.current[refsMatrix.current.length - 1]!
        lastRow[col - 1]!.input.focus()
        return
        */
      }

      // If is last row and is last column, we are at the bottom right corner of the table, so do nothing
      if (isLastRow && isLastCol) {
        e.currentTarget.blur()
        return
      }

      // If not last row, move to next row in same column
      if (!isLastRow) {
        const nextRow = refsMatrix.current[row + 1]!
        nextRow[col]!.input.focus()
        return
      }

      /* Moving between columns is not supported yet due to the way input keys are generated. May be fixed in the future.
      // If is last row, move to first row in next column
      const firstRow = refsMatrix.current[0]!
      firstRow[col + 1]!.input.focus()
      */
    }
  }

  const handleCategoryOut = (
    e: React.FocusEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<string | number>>,
    parent: CategoryParent,
  ) => {
    const previousValue = e.target.dataset.previousValue?.trim()
    const currentValue = e.target.value.trim()

    // If the values are equal, check if they are empty strings
    if (currentValue === previousValue) {
      // If not then do nothing, because no change was made
      if (currentValue !== "") {
        return
      }
      // If both are empty strings, remove the row from the budget because there is nothing to save
      const filteredCategories = budgets.categories.filter((c) => c.name !== "")
      setBudgets((prev) => ({
        ...prev,
        categories: filteredCategories,
      }))
      return
    }

    // Category names should be unique
    const categoryExists = budgets.categories.find(
      (c) => c.name === currentValue,
    )

    /* 
      ========== ADDING NEW CATEGORY ==========
    */

    if (previousValue === "" && currentValue !== "") {
      // If the category already exists, remove the row, cannot add new category with same name
      if (categoryExists) {
        const filteredCategories = budgets.categories.filter(
          (c) => c.id !== "@just-added!",
        )
        setBudgets((prev) => ({
          ...prev,
          categories: filteredCategories,
        }))
        return
      }

      const newCategory: ICategory = {
        id: null,
        name: currentValue,
        userId: userId,
        parent: parent,
      }

      setBudgets((prev) => ({
        categories: prev.categories.map((c) => {
          if (c.id !== "@just-added!") {
            return c
          }
          return newCategory
        }),
        budgetsByYear:
          // If no year budget exist, create one for this year
          prev.budgetsByYear.length === 0
            ? [
                {
                  year: year,
                  budgetsByParent: [
                    {
                      parent: parent,
                      budgetsByCategory: [
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
              ]
            : // Otherwise, update all year budgets with new category name
              prev.budgetsByYear.map((yearBudget) => {
                return {
                  ...yearBudget,
                  // If budgets for this parent don't exist, create them
                  budgetsByParent: !yearBudget.budgetsByParent.find(
                    (b) => b.parent === parent,
                  )
                    ? [
                        ...yearBudget.budgetsByParent,
                        {
                          parent: parent,
                          budgetsByCategory: [
                            {
                              ...newCategory,
                              monthlyAmounts: Array.from(
                                { length: 12 },
                                () => ({
                                  id: null,
                                  amount: 0,
                                }),
                              ),
                            },
                          ],
                        },
                      ]
                    : // Otherwise, update the budgets for this parent
                      yearBudget.budgetsByParent.map((parentBudget) => {
                        if (parentBudget.parent !== parent) {
                          return parentBudget
                        }
                        return {
                          ...parentBudget,
                          // We've determined above that this is a new category, so just add it to the budgetsByCategory array
                          budgetsByCategory: [
                            ...parentBudget.budgetsByCategory,
                            {
                              ...newCategory,
                              monthlyAmounts: Array.from(
                                { length: 12 },
                                () => ({
                                  id: null,
                                  amount: 0,
                                }),
                              ),
                            },
                          ],
                        }
                      }),
                }
              }),
      }))

      setIsDirty(true)
      return
    }

    /* 
      ========== UPDATING CATEGORY NAME ==========
    */

    if (previousValue && previousValue !== "" && currentValue !== "") {
      // If category with this name already exists, set the input value to the previous value
      if (categoryExists) {
        setValue(previousValue)
        return
      }

      setBudgets((prev) => ({
        ...prev,
        categories: prev.categories.map((c) => {
          if (c.name !== previousValue) {
            return c
          }
          return {
            ...c,
            name: currentValue,
          }
        }),
        budgetsByYear: prev.budgetsByYear.map((yearBudget) => {
          return {
            ...yearBudget,
            budgetsByParent: yearBudget.budgetsByParent.map((b) => {
              if (b.parent !== parent) {
                return b
              }

              return {
                ...b,
                budgetsByCategory: b.budgetsByCategory.map((c) => {
                  if (c.name !== previousValue) {
                    return c
                  }

                  return {
                    ...c,
                    name: currentValue,
                  }
                }),
              }
            }),
          }
        }),
      }))

      setIsDirty(true)
      return
    }

    /* 
      ========== REMOVING CATEGORY ==========
    */

    if (previousValue && previousValue !== "" && currentValue === "") {
      setBudgets((prev) => ({
        ...prev,
        categories: prev.categories.filter((c) => c.name !== previousValue),
        budgetsByYear: prev.budgetsByYear.map((yearBudget) => {
          return {
            ...yearBudget,
            budgetsByParent: yearBudget.budgetsByParent.map((b) => {
              if (b.parent !== parent) {
                return b
              }

              return {
                ...b,
                budgetsByCategory: b.budgetsByCategory.filter(
                  (c) => c.name !== previousValue,
                ),
              }
            }),
          }
        }),
      }))

      setIsDirty(true)
      return
    }
  }

  const handleAmountOut = (
    e: React.FocusEvent<HTMLInputElement>,
    { row, col }: { row: number; col: number },
    category: ICategory,
  ) => {
    const previousValue = e.target.dataset.previousValue?.trim()
    const currentValue = e.target.value.trim()

    // If the values are equal then do nothing, because no change was made
    if (currentValue === previousValue) {
      return
    }
    // If previous value is 0 and current value is empty string, do nothing
    if (previousValue === "0.00" && currentValue === "") {
      return
    }

    /*
    ========= ADDING NEW AMOUNT =========
    */

    if (previousValue === "0.00" && currentValue !== "") {
      setBudgets((prev) => ({
        ...prev,
        budgetsByYear:
          // If budgets for this year don't exist, create them
          !prev.budgetsByYear.find((d) => d.year === year)
            ? [
                ...prev.budgetsByYear,
                {
                  year: year,
                  budgetsByParent: prev.categories.reduce(
                    // Reducing to avoid duplicate parents, if budget for parent exists, add category budget to it, otherwise create it
                    (acc, curr) => {
                      const existingParent = acc.find(
                        (b) => b.parent === curr.parent,
                      )

                      if (existingParent) {
                        existingParent.budgetsByCategory.push({
                          ...curr,
                          monthlyAmounts: Array.from({ length: 12 }, (_, i) => {
                            // When creating the budget for the first time, we need to check if the category name matches the current inputs category name
                            return i === col && category.name === curr.name
                              ? {
                                  id: null,
                                  amount: Math.round(
                                    parseFloat(currentValue) * 100,
                                  ),
                                }
                              : { id: null, amount: 0 }
                          }),
                        })

                        return acc
                      } else {
                        return [
                          ...acc,
                          {
                            parent: curr.parent,
                            budgetsByCategory: [
                              {
                                ...curr,
                                monthlyAmounts: Array.from(
                                  { length: 12 },
                                  (_, i) => {
                                    return i === col &&
                                      category.name === curr.name
                                      ? {
                                          id: null,
                                          amount: Math.round(
                                            parseFloat(currentValue) * 100,
                                          ),
                                        }
                                      : { id: null, amount: 0 }
                                  },
                                ),
                              },
                            ],
                          },
                        ]
                      }
                    },
                    [] as IParentBudget[],
                  ),
                },
              ]
            : // Otherwise, add the new amount to the budgets for this year
              prev.budgetsByYear.map((yearBudget) => {
                if (yearBudget.year !== year) {
                  return yearBudget
                }

                return {
                  ...yearBudget,
                  budgetsByParent: yearBudget.budgetsByParent.map(
                    (parentBudget) => {
                      if (parentBudget.parent !== category.parent) {
                        return parentBudget
                      }

                      return {
                        parent: parentBudget.parent,
                        budgetsByCategory:
                          // If budgets for this category don't exist, create them
                          !parentBudget.budgetsByCategory.find(
                            (c) => c.name === category.name,
                          )
                            ? [
                                ...parentBudget.budgetsByCategory,
                                {
                                  ...category,
                                  monthlyAmounts: Array.from(
                                    { length: 12 },
                                    (_, i) => {
                                      return i === col
                                        ? {
                                            id: null,
                                            amount: Math.round(
                                              parseFloat(currentValue) * 100,
                                            ),
                                          }
                                        : { id: null, amount: 0 }
                                    },
                                  ),
                                },
                              ]
                            : // Otherwise, add the new amount to the budgets for this category
                              parentBudget.budgetsByCategory.map((c) => {
                                if (c.name !== category.name) {
                                  return c
                                }

                                return {
                                  ...c,
                                  monthlyAmounts: [
                                    ...c.monthlyAmounts.slice(0, col),
                                    {
                                      id: null,
                                      amount: Math.round(
                                        parseFloat(currentValue) * 100,
                                      ),
                                    },
                                    ...c.monthlyAmounts.slice(col + 1),
                                  ],
                                }
                              }),
                      }
                    },
                  ),
                }
              }),
      }))

      setIsDirty(true)
      return
    }

    /*
    ========= UPDATING AMOUNT =========
    */

    if (previousValue && previousValue !== "" && currentValue !== "") {
      setBudgets((prev) => ({
        ...prev,
        budgetsByYear: prev.budgetsByYear.map((yearBudget) => {
          if (yearBudget.year !== year) {
            return yearBudget
          }

          return {
            ...yearBudget,
            budgetsByParent: yearBudget.budgetsByParent.map((b) => {
              if (b.parent !== category.parent) {
                return b
              }

              return {
                parent: b.parent,
                budgetsByCategory: b.budgetsByCategory.map((c) => {
                  if (c.name !== category.name) {
                    return c
                  }

                  return {
                    ...c,
                    monthlyAmounts: [
                      ...c.monthlyAmounts.slice(0, col),
                      {
                        ...c.monthlyAmounts[col],
                        amount: Math.round(parseFloat(currentValue) * 100),
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

      setIsDirty(true)
      return
    }

    /*
    ========= REMOVING AMOUNT =========
    */

    if (previousValue && previousValue !== "" && currentValue === "") {
      setBudgets((prev) => ({
        ...prev,
        budgetsByYear: prev.budgetsByYear.map((yearBudget) => {
          if (yearBudget.year !== year) {
            return yearBudget
          }

          return {
            ...yearBudget,
            budgetsByParent: yearBudget.budgetsByParent.map((b) => {
              if (b.parent !== category.parent) {
                return b
              }

              return {
                parent: b.parent,
                budgetsByCategory: b.budgetsByCategory.map((c) => {
                  if (c.name !== category.name) {
                    return c
                  }

                  return {
                    ...c,
                    monthlyAmounts: [
                      ...c.monthlyAmounts.slice(0, col),
                      {
                        id: null,
                        amount: 0,
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

      setIsDirty(true)
      return
    }
  }

  const getMonthAmount = (category: ICategory, month: number): number => {
    // Is there a data for this year?
    const yearBudget = budgets.budgetsByYear.find((d) => d.year === year)
    if (!yearBudget) {
      return 0
    }
    // Is there a budget for this parent?
    const parentBudget = yearBudget.budgetsByParent.find(
      (b) => b.parent === category.parent,
    )
    if (!parentBudget) {
      return 0
    }
    // Is this category in the budget?
    const categoryBudget = parentBudget.budgetsByCategory.find(
      (c) => c.name === category.name,
    )
    if (!categoryBudget) {
      return 0
    }
    // Get the amount for this month
    const amountData = categoryBudget.monthlyAmounts[month]
    if (!amountData) {
      return 0
    }
    // convert from cents to dollars
    return amountData.amount / 100
  }

  const getParentTotal = (parent: CategoryParent, month: number): number => {
    const yearBudget = budgets.budgetsByYear.find((d) => d.year === year)
    if (!yearBudget) {
      return 0
    }

    const parentBudget = yearBudget.budgetsByParent.find(
      (b) => b.parent === parent,
    )
    if (!parentBudget) {
      return 0
    }

    const budgetsByCategory = parentBudget.budgetsByCategory
    if (!budgetsByCategory) {
      return 0
    }

    const total = budgetsByCategory.reduce((acc, curr) => {
      const amountData = curr.monthlyAmounts[month]
      if (!amountData) {
        return acc
      }
      return acc + amountData.amount
    }, 0)

    return total / 100
  }

  return (
    <>
      <div
        className={
          "sticky left-0 top-0 z-40 flex h-[48px] items-center justify-between gap-2 border-b bg-white px-4"
        }
      >
        <YearPicker onYearChange={hanldeYearChange}>{year}</YearPicker>
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            className="h-8 font-normal focus-visible:border-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime-500"
            disabled={!isDirty}
            onClick={handleSave}
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
              <th className="sticky left-0 cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r border-b-lime-500 bg-white px-1.5 text-left text-base font-normal text-lime-600">
                Category
              </th>
              <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r border-b-lime-500 bg-white px-1.5 text-right text-base font-normal text-lime-600">
                Jan
              </th>
              <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r border-b-lime-500 bg-white px-1.5 text-right text-base font-normal text-lime-600">
                Feb
              </th>
              <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r border-b-lime-500 bg-white px-1.5 text-right text-base font-normal text-lime-600">
                Mar
              </th>
              <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r border-b-lime-500 bg-white px-1.5 text-right text-base font-normal text-lime-600">
                Apr
              </th>
              <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r border-b-lime-500 bg-white px-1.5 text-right text-base font-normal text-lime-600">
                May
              </th>
              <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r border-b-lime-500 bg-white px-1.5 text-right text-base font-normal text-lime-600">
                Jun
              </th>
              <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r border-b-lime-500 bg-white px-1.5 text-right text-base font-normal text-lime-600">
                Jul
              </th>
              <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r border-b-lime-500 bg-white px-1.5 text-right text-base font-normal text-lime-600">
                Aug
              </th>
              <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r border-b-lime-500 bg-white px-1.5 text-right text-base font-normal text-lime-600">
                Sep
              </th>
              <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r border-b-lime-500 bg-white px-1.5 text-right text-base font-normal text-lime-600">
                Oct
              </th>
              <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r border-b-lime-500 bg-white px-1.5 text-right text-base font-normal text-lime-600">
                Nov
              </th>
              <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-b-lime-500 bg-white px-1.5 text-right text-base font-normal text-lime-600">
                Dec
              </th>
            </tr>
          </thead>
          <tbody>
            {parentNames.map((parentName) => (
              <React.Fragment key={parentName}>
                {/* Parent Totals Row */}
                <tr key={parentName}>
                  <td className="sticky left-0 cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r bg-white px-1.5 text-left text-base font-normal text-zinc-900 mobile:text-sm">
                    {toTitleCase(parentName)}
                  </td>
                  {Array.from({ length: 12 }).map((_, col) => (
                    <td
                      key={`${parentName}-${col}-${new Date().getTime()}`}
                      className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r bg-white px-1.5 text-right text-base font-normal text-zinc-900 mobile:text-sm"
                    >
                      {formatCurrency(getParentTotal(parentName, col))}
                    </td>
                  ))}
                </tr>

                {/* Child Rows */}
                {budgets.categories
                  .filter((c) => c.parent === parentName)
                  .map((category) => {
                    const row = totalRowIndex++
                    return (
                      <tr key={row} className="group">
                        <td className="sticky left-0 z-10 cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r bg-white px-2 text-left text-base font-normal text-zinc-500 group-hover:bg-accent mobile:text-sm">
                          <MyInput
                            key={`${category.name}-${new Date().getTime()}`}
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
                              e.currentTarget.select()
                              e.target.dataset.previousValue = e.target.value
                            }}
                            onFocusOut={({ e, setValue }) =>
                              handleCategoryOut(e, setValue, parentName)
                            }
                            onKeyDown={(e) =>
                              handleKeyDown(e, { row: row, col: 0 })
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
                              key={`${year}-${
                                category.name
                              }-${col}-${new Date().getTime()}`}
                              name={`${year}-${category.name}-${col}`}
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
                                e.currentTarget.select()
                                e.target.dataset.previousValue = e.target.value
                              }}
                              onFocusOut={({ e }) =>
                                handleAmountOut(e, { row, col }, category)
                              }
                              onKeyDown={(e) =>
                                handleKeyDown(e, { row: row, col: col + 1 })
                              }
                            />
                          </td>
                        ))}
                      </tr>
                    )
                  })}

                {/* Add Button Row */}
                <tr key={`${parentName}-add`}>
                  <td
                    className={cn(
                      "sticky left-0 z-10 h-6 border-b bg-white pl-3 text-base text-zinc-400 transition hover:cursor-pointer hover:bg-white hover:text-zinc-900 mobile:text-sm",
                      parentName === "savings" && "border-b-0",
                    )}
                    onClick={() => handleAddRow(parentName)}
                  >
                    <IoAddCircleOutline className="mr-1 inline-block h-full pb-[2px]" />
                    Add
                  </td>
                  {Array.from({ length: 12 }).map((_, index) => (
                    <td
                      key={index}
                      className={cn(
                        "border-b bg-white hover:cursor-default",
                        parentName === "savings" && "border-b-0",
                      )}
                    ></td>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
          <tfoot className="sticky bottom-0 z-30 bg-white">
            <tr>
              <td className="sticky left-0 cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r border-t border-t-lime-500 bg-white px-1.5 text-left text-base font-normal text-lime-600 mobile:text-sm">
                Total
              </td>
              {Array.from({ length: 12 }).map((_, col) => (
                <td
                  key={col}
                  className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r border-t border-t-lime-500 bg-white px-1.5 text-right text-base font-normal text-lime-600 mobile:text-sm"
                >
                  {formatCurrency(
                    budgets.categories.reduce((acc, curr) => {
                      if (curr.parent === "income") {
                        return acc + getMonthAmount(curr, col)
                      } else {
                        return acc - getMonthAmount(curr, col)
                      }
                    }, 0),
                  )}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>

        {isSaving && (
          <Dialog open={isSaving}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Saving...</DialogTitle>
                <DialogDescription>
                  Please wait while we save your changes.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  )
}

export default BudgetClient
