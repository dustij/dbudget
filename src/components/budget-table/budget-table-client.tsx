"use client"

import React, { FC, useCallback, useEffect, useRef, useState } from "react"
import { cn } from "~/lib/utils"
import { IoAddCircleOutline } from "react-icons/io5"
import { MyInput } from "../my-input"
import YearPicker from "../year-picker"

interface refCategoryObject {
  element: HTMLInputElement | null
  id: string | null
}

interface BudgetTableClientProps {
  className?: string
  userId: string
  data: AmountsModel[]
  updateAmountsInDb: (payload: {
    userId: string
    year: number
    categoryId: string
    month: string
    amount: string
  }) => Promise<void>
  insertCategoryInDb: (payload: {
    userId: string
    name: string
    parent: CategoryParent
  }) => Promise<void>
}

const BudgetTableClient: FC<BudgetTableClientProps> = ({
  data,
  updateAmountsInDb,
  insertCategoryInDb,
  className,
  userId,
}) => {
  const refsMatrix = useRef<refCategoryObject[][]>([])
  const [budgetData, setBudgetData] = useState<AmountsModel[]>(data)
  const [categoryPosition, setCategoryPosition] = useState<
    [number, number] | null
  >(null) // [row, col]
  const [year, setYear] = useState<number>(2023)

  const subCategories = budgetData.flatMap((parent) => parent.categories)

  // Initialize refsMatrix.current to a matrix of nulls
  for (const rowIndex of Array(subCategories.length).keys()) {
    refsMatrix.current[rowIndex] = []
    for (const colIndex of Array(13).keys()) {
      // 13 because 12 months + 1 for category name
      refsMatrix.current[rowIndex]![colIndex] = { element: null, id: null }
    }
  }

  useEffect(() => {
    if (categoryPosition) {
      refsMatrix.current[categoryPosition[0]]?.[
        categoryPosition[1]
      ]?.element?.focus()
    }
  }, [categoryPosition])

  const hanldeYearChange = useCallback((year: number) => {
    setYear(year)
  }, [])

  const addCategory = (parentIndex: number, rowIndex: number) => {
    const newCategory = {
      id: `temp_${Math.random() * 100000000}`,
      name: "",
      parent: "" as CategoryParent,
      monthlyAmounts: Array.from({ length: 12 }).fill(0) as number[],
    }
    let newRowIndex = 0
    setBudgetData((prevData) => {
      const newData = [...prevData]
      const parent = newData[parentIndex]! // Can use assertion here because parentIndex is created when mapping over budgetData parents (which are guaranteed to exist)
      newCategory.parent = parent.parent
      const categories = parent.categories ?? []
      const newCategories = [...categories.slice(0, rowIndex + 1), newCategory]
      newData[parentIndex] = {
        ...parent,
        categories: newCategories,
      }
      const subCategories = newData.flatMap((parent) => parent.categories)
      newRowIndex = subCategories.findIndex((cat) => cat === newCategory)
      setCategoryPosition([newRowIndex, 0])
      console.log("finished setCategoryPosition =====================")
      console.log("refsMatrix.current", refsMatrix.current)
      return newData
    })
    console.log("finished setBudgetData =====================")
    console.log("refsMatrix.current", refsMatrix.current)
    console.log("=============================================")
  }

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
        console.log("nextRowIndex", nextRowIndex)
        console.log("colIndex", colIndex)
        console.log("refsMatrix.current", refsMatrix.current)
        console.log(
          "refsMatrix.current[nextRowIndex]",
          refsMatrix.current[nextRowIndex]?.forEach((ref, i) =>
            console.log(i, ":", ref),
          ),
        )
        console.log(
          "refsMatrix.current[nextRowIndex]?.[colIndex]",
          refsMatrix.current[nextRowIndex]?.[colIndex],
        )
        refsMatrix.current[nextRowIndex]?.[colIndex]?.element?.focus()
      } else {
        // Move focus to the first input in the next column
        const nextColIndex = colIndex + 1
        // Can use assertion here because we know that the first row exists (because we're in it)
        if (nextColIndex < refsMatrix.current[0]!.length) {
          refsMatrix.current[0]?.[nextColIndex]?.element?.focus()
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
        refsMatrix.current[prevRowIndex]?.[colIndex]?.element?.focus()
      } else {
        // Move focus to the last input in the previous column
        const prevColIndex = colIndex - 1
        if (prevColIndex >= 0) {
          refsMatrix.current[refsMatrix.current.length - 1]?.[
            prevColIndex
          ]?.element?.focus()
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
        refsMatrix.current[rowIndex]?.[prevColIndex]?.element?.focus()
      } else {
        // Move focus to the last input in the previous row
        const prevRowIndex = rowIndex - 1
        if (prevRowIndex >= 0) {
          refsMatrix.current[prevRowIndex]?.[
            // Can use assertion here because we know that the previous row exists (because we just checked)
            refsMatrix.current[prevRowIndex]!.length - 1
          ]?.element?.focus()
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
        refsMatrix.current[rowIndex]?.[nextColIndex]?.element?.focus()
      } else {
        // Move focus to the first input in the next row
        const nextRowIndex = rowIndex + 1
        if (refsMatrix.current[nextRowIndex]?.[0]) {
          refsMatrix.current[nextRowIndex]?.[0]?.element?.focus()
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

  const handleSubmit = (
    e: React.FocusEvent,
    parent: CategoryParent,
    categoryId: string, // For some reason this needs to be optional for the key events to work
  ) => {
    const target = e.target as HTMLInputElement
    const value = target.value.trim()
    const month = target.dataset.month
    const isAmount = target.dataset.isamount === "true"

    console.log("isAmount", isAmount)
    console.log("categoryId", categoryId)

    // Handle newly added category
    if (!isAmount) {
      const isTempCategory = categoryId?.startsWith("temp_")
      if (isTempCategory) {
        if (!value) {
          console.log("handleSubmit - value is empty")
          // Remove the category from the table
          setBudgetData((prevData) => {
            const newData = [...prevData]
            const parentIndex = newData.findIndex(
              (parent) =>
                parent.categories?.findIndex((cat) => cat.id === categoryId) !==
                -1,
            )
            const parent = newData[parentIndex]! // Can use assertion here because parentIndex is created when mapping over budgetData parents (which are guaranteed to exist)
            const categories = parent.categories ?? []
            const newCategories = categories.filter(
              (cat) => cat.id !== categoryId,
            )
            newData[parentIndex] = {
              ...parent,
              categories: newCategories,
            }
            return newData
          })
        } else {
          console.log("handleSubmit - value is not empty => ", value)
          // Add the category to the database
          console.log({ name: value, parent: parent, userId: userId })
          insertCategoryInDb({ name: value, parent: parent, userId: userId })
        }
      } else {
        console.log("handleSubmit - is not temp category")
        // Handle existing category name change
      }

      // Handle existing category name change
    } else if (isAmount && month) {
      console.log("handleSubmit - isAmount && month", value)

      // Handle existing category new amount

      // Handle existing category existing amount change
    }
  }

  let totalRowIndex = 0 // track row index across different parents
  return (
    <>
      <div className="sticky left-0 top-0 z-30 flex h-[33px] items-center justify-center border-b bg-white">
        <YearPicker onYearChange={hanldeYearChange}>{2023}</YearPicker>
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
            {budgetData.map((data, parentIndex) => {
              return (
                <React.Fragment key={parentIndex}>
                  <tr key={parentIndex}>
                    <td className="sticky left-0 z-20 border-b bg-white px-1.5 text-base font-normal text-zinc-400 hover:cursor-default hover:bg-white mobile:text-sm">
                      {data.parent.charAt(0).toUpperCase() +
                        data.parent.slice(1)}
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
                              key={category.id}
                              myValue={category.name}
                              data-isamount={false}
                              ref={(input) => {
                                refsMatrix.current[currentRowIndex]![0] = {
                                  element: input,
                                  id: category.id,
                                }
                              }}
                              onFocus={(e) => e.currentTarget.select()}
                              onBlur={(e) =>
                                handleSubmit(e, data.parent, category.id)
                              }
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
                                data-month={colIndex + 1}
                                data-isamount={true}
                                myValue={amount}
                                ref={(input) => {
                                  refsMatrix.current[currentRowIndex]![
                                    colIndex + 1
                                  ] = { element: input, id: category.id }
                                }}
                                onFocus={(e) => e.currentTarget.select()}
                                onLoseFocus={(e) =>
                                  handleSubmit(e, data.parent, category.id)
                                }
                                onKeyDown={(e) =>
                                  handleKeyDown(
                                    e,
                                    currentRowIndex,
                                    colIndex + 1,
                                  )
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
      </div>
    </>
  )
}

export default BudgetTableClient
