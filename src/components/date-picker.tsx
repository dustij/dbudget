"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"

export const DateCellInput = ({ className }: { className?: string }) => {
  const [date, setDate] = React.useState<Date>()
  return (
    <input
      type="date"
      className={cn(
        "absolute left-0 top-0 h-full w-full cursor-default overflow-hidden text-ellipsis whitespace-nowrap rounded bg-transparent px-1.5 pl-2.5 text-left text-base text-zinc-900 [appearance:textfield] selection:bg-lime-200 hover:cursor-default focus-visible:bg-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-lime-500 mobile:text-sm",
        className,
      )}
    />
  )
}

export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
