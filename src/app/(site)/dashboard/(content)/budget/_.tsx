import type { FC } from "react"
import {
  Spreadsheet,
  SpreadsheetBody,
  SpreadsheetHeader,
  SpreadsheetRow,
  SpreadsheetCell,
  SpreadsheetHeaderCell,
  SpreadsheetSection,
} from "../components/spreadsheet"
import YearPicker from "~/components/year-picker"

interface BudgetProps {}

interface CategoryData {
  category: string
  jan?: number
  feb?: number
  mar?: number
  apr?: number
  may?: number
  jun?: number
  jul?: number
  aug?: number
  sep?: number
  oct?: number
  nov?: number
  dec?: number
}

interface BudgetData {
  [key: string]: CategoryData[]
}

const Budget: FC<BudgetProps> = () => {
  const sections = [
    "Fixed",
    "Variable",
    "Discretionary",
    "Obligations",
    "Leaks",
  ]

  const data: BudgetData = {
    fixed: [
      {
        category: "Rent",
        feb: 1800,
        mar: 1800,
        apr: 1800,
        may: 1800,
        jun: 1800,
        jul: 1800,
        aug: 1800,
        sep: 1800,
        oct: 1800,
        nov: 1800,
        dec: 1800,
      },
    ],
  }

  return (
    <>
      <div className="sticky left-0 top-0 z-20 flex h-[33px] items-center justify-center border-b bg-white">
        <YearPicker>{2021}</YearPicker>
      </div>
      <div className="relative">
        <Spreadsheet>
          <SpreadsheetHeader className="top-[33px]">
            <SpreadsheetRow>
              <SpreadsheetHeaderCell className="sticky left-0 bg-white text-left">
                Category
              </SpreadsheetHeaderCell>
              <SpreadsheetHeaderCell>Jan</SpreadsheetHeaderCell>
              <SpreadsheetHeaderCell>Feb</SpreadsheetHeaderCell>
              <SpreadsheetHeaderCell>Mar</SpreadsheetHeaderCell>
              <SpreadsheetHeaderCell>Apr</SpreadsheetHeaderCell>
              <SpreadsheetHeaderCell>May</SpreadsheetHeaderCell>
              <SpreadsheetHeaderCell>Jun</SpreadsheetHeaderCell>
              <SpreadsheetHeaderCell>Jul</SpreadsheetHeaderCell>
              <SpreadsheetHeaderCell>Aug</SpreadsheetHeaderCell>
              <SpreadsheetHeaderCell>Sep</SpreadsheetHeaderCell>
              <SpreadsheetHeaderCell>Oct</SpreadsheetHeaderCell>
              <SpreadsheetHeaderCell>Nov</SpreadsheetHeaderCell>
              <SpreadsheetHeaderCell>Dec</SpreadsheetHeaderCell>
            </SpreadsheetRow>
          </SpreadsheetHeader>
          <SpreadsheetBody>
            {sections.map((section, sectionIndex) => (
              <SpreadsheetSection key={sectionIndex} name={section}>
                {data[`${section.toLowerCase()}`]?.map((row) => (
                  <SpreadsheetRow key={row.category}>
                    <SpreadsheetCell
                      className="sticky left-0 z-10 pl-3"
                      inputType="text"
                    >
                      {row.category}
                    </SpreadsheetCell>
                    <SpreadsheetCell>{row.jan ?? 0}</SpreadsheetCell>
                    <SpreadsheetCell>{row.feb}</SpreadsheetCell>
                    <SpreadsheetCell>{row.mar}</SpreadsheetCell>
                    <SpreadsheetCell>{row.apr}</SpreadsheetCell>
                    <SpreadsheetCell>{row.may}</SpreadsheetCell>
                    <SpreadsheetCell>{row.jun}</SpreadsheetCell>
                    <SpreadsheetCell>{row.jul}</SpreadsheetCell>
                    <SpreadsheetCell>{row.aug}</SpreadsheetCell>
                    <SpreadsheetCell>{row.sep}</SpreadsheetCell>
                    <SpreadsheetCell>{row.oct}</SpreadsheetCell>
                    <SpreadsheetCell>{row.nov}</SpreadsheetCell>
                    <SpreadsheetCell>{row.dec}</SpreadsheetCell>
                  </SpreadsheetRow>
                ))}
              </SpreadsheetSection>
            ))}
          </SpreadsheetBody>
        </Spreadsheet>
      </div>
    </>
  )
}

export default Budget
