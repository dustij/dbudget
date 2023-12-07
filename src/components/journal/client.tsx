"use client"

import { FC, Suspense, useRef, useState } from "react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import YearPicker from "../year-picker"
import { MyInput } from "../my-input"
import { DateCellInput } from "../date-picker"

interface RefItem {
  input: HTMLInputElement
  category: ICategory
}

interface JournalClientProps {
  userId: string
  data: IJournalData
  action: {
    getServerJournals: () => Promise<IJournalData>
    setServerJournals: (data: IJournalData) => Promise<IJournalData>
  }
}

const JournalClient: FC<JournalClientProps> = ({ userId, data, action }) => {
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [journals, setJournals] = useState<IJournalData>(data)
  const [isDirty, setIsDirty] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const refsMatrix = useRef<RefItem[][]>([])

  // Eventually I will want this page to load scrolled to the bottom, where we will enter new journal entries.
  // This resource may be helpful: https://nextjs.org/docs/app/api-reference/functions/use-router#disabling-scroll-restoration

  const hanldeYearChange = (year: number) => {
    setYear(year)
  }

  const handleSave = async () => {
    setIsSaving(true)
    const data = await action.setServerJournals(journals)
    setJournals(data)
    setIsDirty(false)
    setIsSaving(false)
  }

  const handleCancel = async () => {
    const data = await action.getServerJournals()
    setJournals(data)
    setIsDirty(false)
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
            "w-full min-w-[300px] table-fixed border-separate border-spacing-0 bg-white text-[14px]"
          }
        >
          <thead className="sticky top-[48px] z-30 h-[33px] bg-white">
            <tr>
              <th className="sticky left-0 cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r border-b-lime-500 bg-white px-1.5 text-left text-base font-normal text-lime-600">
                Date
              </th>
              <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r border-b-lime-500 bg-white px-1.5 text-right text-base font-normal text-lime-600">
                Category
              </th>
              <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-r border-b-lime-500 bg-white px-1.5 text-right text-base font-normal text-lime-600">
                Amount
              </th>
              <th className="cursor-default overflow-hidden text-ellipsis whitespace-nowrap border-b border-b-lime-500 bg-white px-1.5 text-right text-base font-normal text-lime-600">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="relative h-6 border-b border-r p-0 group-hover:bg-accent">
                <DateCellInput />
              </td>
              <td className="relative h-6 border-b border-r p-0 group-hover:bg-accent"></td>
              <td className="relative h-6 border-b border-r p-0 group-hover:bg-accent">
                <MyInput
                  className="w-full text-zinc-500"
                  type="number"
                  value={0}
                  onFocus={(e) => {
                    e.currentTarget.select()
                  }}
                />
              </td>
              <td className="relative h-6 border-b border-r p-0 group-hover:bg-accent"></td>
            </tr>
          </tbody>
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

export default JournalClient
