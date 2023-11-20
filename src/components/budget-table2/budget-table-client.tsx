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

const BudgetTableClient: FC<BudgetTableClientProps> = ({
  className,
  budget,
}) => {
  const [year, setYear] = useState<number>(2023)
  const [yearData, setYearData] = useState<IYearData | null>(
    budget.yearData.find((yearData) => yearData.year === year) || null,
  )
  const refsMatrix = useRef<ICategoryRef[][]>([])

  // Initialize refsMatrix
  const childCategories =
    yearData?.amounts.flatMap((amount) => amount.categories) || []
  for (const row of Array(childCategories.length).keys()) {
    refsMatrix.current[row] = []
    for (const col of Array(13).keys()) {
      refsMatrix.current[row]![col] = { input: null, category: null }
    }
  }

  useEffect(() => {
    // console.log(JSON.stringify(refsMatrix.current, null, 2))
    console.log(refsMatrix.current)
  }, [])

  const hanldeYearChange = useCallback((year: number) => {
    setYear(year)
  }, [])

  const handleAddRow = (categoryParent: CategoryParent) => {
    const newCategory: IExtendedCategory = {
      id: "new-category",
      name: "",
      parent: categoryParent,
      monthlyAmounts: Array.from({ length: 12 }).map(() => 0),
      userId: "",
      ruleId: "",
      createdAt: "",
      updatedAt: "",
    }

    setYearData((prev) => {
      if (!prev) return null
      const newAmounts = [
        ...prev.amounts,
        { parent: categoryParent, categories: [newCategory] },
      ]

      return { ...prev, amounts: newAmounts }
    })
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
            {CATEGORY_PARENTS.map((categoryParent, parentIndex) => {
              return (
                <React.Fragment key={parentIndex}>
                  {/* Parent Category Row */}
                  <tr key={parentIndex}>
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

                  {/* Child Categories */}
                  {yearData &&
                    yearData.amounts
                      .filter(
                        (data) =>
                          data.parent === categoryParent &&
                          data.categories.length > 0,
                      )
                      .map((amount) => {
                        return amount.categories.map((category, rowIndex) => {
                          const row = totalRowIndex++
                          return (
                            <tr key={category.id}>
                              <td className="sticky left-0 z-20 border-b border-r bg-white p-0">
                                <MyInput
                                  key={category.id}
                                  myValue={category.name}
                                  ref={(input) => {
                                    refsMatrix.current[row]![0] = {
                                      input,
                                      category,
                                    }
                                  }}
                                />
                              </td>
                              {category.monthlyAmounts.map((amount, col) => (
                                <td
                                  key={col}
                                  className={cn(
                                    "relative h-6 border-b border-r p-0",
                                    col === 11 && "border-r-0",
                                  )}
                                >
                                  <MyInput
                                    key={col}
                                    type="number"
                                    step={"0.01"}
                                    myValue={amount}
                                    ref={(input) => {
                                      refsMatrix.current[row]![col + 1] = {
                                        input,
                                        category,
                                      }
                                    }}
                                  />
                                </td>
                              ))}
                            </tr>
                          )
                        })
                      })}

                  {/* Add Button Row */}
                  <tr key={`add-category-${parentIndex}`}>
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
