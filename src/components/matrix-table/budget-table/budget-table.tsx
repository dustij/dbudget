"use client"

import type { FC } from "react"
import { IoAddCircleOutline } from "react-icons/io5"
import MatrixTable, { MatrixTableProps } from "../matrix-table"

const BudgetTable: FC<MatrixTableProps> = ({
  className,
  rows,
  columns,
  headers,
}) => {
  const handleSubmit = (data: {
    row: (HTMLInputElement | null)[] | undefined
    header: string | undefined
    value: string
  }) => {
    console.log(data)
  }

  return (
    <MatrixTable
      className={className}
      rows={rows}
      columns={columns}
      headers={headers}
      onSubmit={handleSubmit}
    >
      <tr>
        <td className="sticky left-0 z-10 font-semibold hover:bg-white">
          Fixed
        </td>
      </tr>
      {/* fixed category rows */}
      <tr>
        <td
          className="sticky left-0 z-10 pl-3 text-zinc-400 transition hover:cursor-pointer hover:bg-zinc-50 hover:text-zinc-900"
          onClick={() => {
            /* add row */
          }}
        >
          <IoAddCircleOutline className="mr-1 inline-block" />
          Add
        </td>
      </tr>

      <tr>
        <td className="sticky left-0 z-10 font-semibold hover:bg-white">
          Variable
        </td>
      </tr>
      {/* variable category rows */}
      <tr>
        <td
          className="sticky left-0 z-10 pl-3 text-zinc-400 transition hover:cursor-pointer hover:bg-zinc-50 hover:text-zinc-900"
          onClick={() => {
            /* add row */
          }}
        >
          <IoAddCircleOutline className="mr-1 inline-block" />
          Add
        </td>
      </tr>

      <tr>
        <td className="sticky left-0 z-10 font-semibold hover:bg-white">
          Discretionary
        </td>
      </tr>
      {/* discretionary category rows */}
      <tr>
        <td
          className="sticky left-0 z-10 pl-3 text-zinc-400 transition hover:cursor-pointer hover:bg-zinc-50 hover:text-zinc-900"
          onClick={() => {
            /* add row */
          }}
        >
          <IoAddCircleOutline className="mr-1 inline-block" />
          Add
        </td>
      </tr>

      <tr>
        <td className="sticky left-0 z-10 font-semibold hover:bg-white">
          Obligations
        </td>
      </tr>
      {/* obligations category rows */}
      <tr>
        <td
          className="sticky left-0 z-10 pl-3 text-zinc-400 transition hover:cursor-pointer hover:bg-zinc-50 hover:text-zinc-900"
          onClick={() => {
            /* add row */
          }}
        >
          <IoAddCircleOutline className="mr-1 inline-block" />
          Add
        </td>
      </tr>

      <tr>
        <td className="sticky left-0 z-10 font-semibold hover:bg-white">
          Leaks
        </td>
      </tr>
      {/* leaks category rows */}
      <tr>
        <td
          className="sticky left-0 z-10 pl-3 text-zinc-400 transition hover:cursor-pointer hover:bg-zinc-50 hover:text-zinc-900"
          onClick={() => {
            /* add row */
          }}
        >
          <IoAddCircleOutline className="mr-1 inline-block" />
          Add
        </td>
      </tr>
    </MatrixTable>
  )
}

export default BudgetTable
