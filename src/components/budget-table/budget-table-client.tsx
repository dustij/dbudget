"use client"

import React, { type FC, useState, useEffect, useRef } from "react"
import YearPicker from "../year-picker"
import { IoAddCircleOutline } from "react-icons/io5"
import { CATEGORY_PARENTS } from "~/lib/constants"
import { toTitleCase } from "~/lib/utils"

interface BudgetTableClientProps {
  data: IBudget
}

const BudgetTableClient: FC<BudgetTableClientProps> = ({ data }) => {
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [budget, setBudget] = useState<IBudget>(data)

  const hanldeYearChange = (year: number) => {
    setYear(year)
  }

  const handleAddRow = (parent: CategoryParent) => {}

  return (
    <>
      <div
        className={
          "sticky left-0 top-0 z-30 flex h-[48px] items-center justify-between gap-2 border-b bg-white px-4"
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
                  .map((c) => (
                    <tr key={c.id}>
                      <td className="sticky left-0 cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r bg-white px-2 text-left text-base font-normal text-zinc-500 mobile:text-sm">
                        {c.name}
                      </td>
                      {Array.from({ length: 12 }).map((_, i) => (
                        <td
                          key={i}
                          className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r bg-white px-1.5 text-right text-base font-normal text-zinc-500 mobile:text-sm"
                        >
                          0.00
                        </td>
                      ))}
                    </tr>
                  ))}

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
