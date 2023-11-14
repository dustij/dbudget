"use client"

import React, { FC, useRef, useState } from "react"
import { CategoryParent } from "../../../../temp/categories"
import { cn } from "~/lib/utils"
import { IoAddCircleOutline } from "react-icons/io5"

interface BudgetTableClientProps {
  className?: string
  data: CategoryParent[]
}

const BudgetTableClient: FC<BudgetTableClientProps> = ({ data, className }) => {
  const refsMatrix = useRef<(HTMLInputElement | null)[][]>([])
  const [budgetData, setBudgetData] = useState<CategoryParent[]>(data)

  for (const i of Array(budgetData.length).keys()) {
    const categoryParent = budgetData[i]
    for (const g of Array.from({
      length: categoryParent?.categories.length ?? 0,
    }).keys()) {
      refsMatrix.current[g * (i + 1)] = []
      for (const j of Array(13).keys()) {
        // we just initialized refsMatrix.current[i] to [], so it's safe to use a non-null assertion here
        refsMatrix.current[g * (i + 1)]![j] = null
      }
    }
  }

  const addCategory = (parentIndex: number, rowIndex: number) => {
    console.log("add category")
    const newCategory = {
      id: Math.floor(Math.random() * 1000000),
      name: "",
      monthlyAmounts: Array.from({ length: 12 }).fill(0) as number[],
    }
    setBudgetData((prevData) => {
      const newData = [...prevData]
      const parent = newData[parentIndex]
      const categories = parent?.categories ?? []
      const newCategory = {
        id: Math.floor(Math.random() * 1000000),
        name: "",
        monthlyAmounts: Array.from({ length: 12 }).fill(0) as number[],
      }
      const newCategories = [...categories.slice(0, rowIndex + 1), newCategory]
      newData[parentIndex] = {
        ...parent!,
        categories: newCategories,
        id: parent?.id || Math.floor(Math.random() * 1000000),
        name: parent?.name || "", // add a fallback value for name
      }
      return newData
    })
  }

  return (
    <table
      className={cn(
        "w-full min-w-[1070px] table-fixed border-separate border-spacing-0 text-[14px]",
        className,
      )}
    >
      <tbody>
        {budgetData.map((parent, parentIndex) => {
          return (
            <React.Fragment key={parent.id}>
              <tr key={parent.id}>
                <td>{parent.name}</td>
                {Array.from({ length: 12 }).map((_, index) => (
                  <td key={index}></td>
                ))}
              </tr>
              {parent.categories.map((category, rowIndex) => {
                return (
                  <React.Fragment key={category.id}>
                    <tr key={category.id}>
                      <td>
                        <input
                          className="w-full"
                          defaultValue={category.name}
                          // value={category.name}
                          ref={(input) => {
                            refsMatrix.current[rowIndex]![0] = input
                          }}
                        />
                      </td>

                      {category.monthlyAmounts.map((amount, i) => (
                        <td key={i}>
                          <input
                            className="w-full"
                            defaultValue={amount}
                            // value={amount}
                            ref={(input) => {
                              refsMatrix.current[rowIndex]![1] = input
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                    {rowIndex === parent.categories.length - 1 && (
                      <tr key={`add-category-${parent.id}`}>
                        <td
                          className="sticky left-0 z-10 pl-3 text-zinc-400 transition hover:cursor-pointer hover:bg-zinc-50 hover:text-zinc-900"
                          onClick={() => addCategory(parentIndex, rowIndex)}
                        >
                          <IoAddCircleOutline className="mr-1 inline-block" />
                          Add
                        </td>
                        {Array.from({ length: 12 }).map((_, index) => (
                          <td key={index}></td>
                        ))}
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </React.Fragment>
          )
        })}
      </tbody>
    </table>
  )
}

export default BudgetTableClient
