"use client"

import { FC, useRef, useState } from "react"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "../ui/menubar"
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { cn } from "~/lib/utils"
import { IoAddCircleOutline } from "react-icons/io5"
import { categories } from "~/db/schema"

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
            className="h-8 font-normal focus:border-0 focus:outline-none focus:ring-1 focus:ring-lime-500"
            disabled={!isDirty}
            onClick={handleSave}
          >
            Save
          </Button>
          <Button
            variant="outline"
            className="h-8 font-normal text-zinc-600 hover:text-zinc-900 focus:outline-none focus:ring-1 focus:ring-lime-500"
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
            {journals.journalsByYear
              .filter((j) => j.year === year)[0]
              ?.journals.map((journal) => (
                <tr key={journal.id} className="group">
                  <td className="relative h-6 border-b border-r p-0 text-zinc-500 group-hover:bg-accent">
                    <DateCellInput
                      key={`${journal.id}-${journal.date}`}
                      className="text-zinc-500"
                      date={journal.date}
                    />
                  </td>

                  <td className="relative h-6 border-b border-r p-0 group-hover:bg-accent">
                    <Select key={`${journal.id}-${journal.categoryId}`}>
                      <SelectTrigger className="h-6 w-full border-transparent text-zinc-500 outline-none outline-0 ring-0 focus:border-lime-500 focus:outline-0 focus:ring-0 group-hover:bg-accent mobile:text-sm">
                        <SelectValue
                          placeholder={
                            journals.categories.filter(
                              (c) => c.id === journal.categoryId,
                            )[0]?.name ?? "Select a category"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Categories</SelectLabel>
                          {journals.categories.map((category) => (
                            <SelectItem
                              key={`${journal.id}-${category.id}`}
                              value={category.id ?? ""}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="food">Food</SelectItem>
                          <SelectItem value="gas">Gas</SelectItem>
                          <SelectItem value="entertainment">
                            Entertainment
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </td>

                  <td className="relative h-6 border-b border-r p-0 group-hover:bg-accent">
                    <MyInput
                      key={`${journal.id}-amount`}
                      className="w-full text-zinc-500"
                      type="number"
                      value={journal.amount / 100}
                      onFocus={(e) => {
                        e.currentTarget.select()
                      }}
                    />
                  </td>

                  <td className="relative h-6 border-b border-r p-0 group-hover:bg-accent">
                    <MyInput
                      key={`${journal.id}-notes`}
                      className="w-full text-zinc-500"
                      type="text"
                      value={journal.notes ?? ""}
                      onFocus={(e) => {
                        e.currentTarget.select()
                      }}
                    />
                  </td>
                </tr>
              ))}
            {/* <tr className="group">
              <td className="relative h-6 border-b border-r p-0 text-zinc-500 group-hover:bg-accent">
                <DateCellInput className="text-zinc-500" />
              </td>

              <td className="relative h-6 border-b border-r p-0 group-hover:bg-accent">
                <Select>
                  <SelectTrigger className="h-6 w-full border-transparent text-zinc-500 outline-none outline-0 ring-0 focus:border-lime-500 focus:outline-0 focus:ring-0 group-hover:bg-accent mobile:text-sm">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="gas">Gas</SelectItem>
                      <SelectItem value="entertainment">
                        Entertainment
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </td>

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

              <td className="relative h-6 border-b border-r p-0 group-hover:bg-accent">
                <MyInput
                  className="w-full text-zinc-500"
                  type="text"
                  value={""}
                  onFocus={(e) => {
                    e.currentTarget.select()
                  }}
                />
              </td>
            </tr> */}
            <tr>
              <td
                className={cn(
                  "sticky left-0 z-10 h-6 border-b bg-white pl-3 text-base text-zinc-400 transition hover:cursor-pointer hover:bg-white hover:text-zinc-900 mobile:text-sm",
                )}
                // onClick={() => handleAddRow(parentName)}
              >
                <IoAddCircleOutline className="mr-1 inline-block h-full pb-[2px]" />
                Add
              </td>
              {Array.from({ length: 3 }).map((_, index) => (
                <td
                  key={index}
                  className={cn("border-b bg-white hover:cursor-default")}
                ></td>
              ))}
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
