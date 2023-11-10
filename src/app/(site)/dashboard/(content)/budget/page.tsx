import type { FC } from "react"
import {
  Spreadsheet,
  SpreadsheetBody,
  SpreadsheetHeader,
  SpreadsheetRow,
  SpreadsheetCell,
  SpreadsheetHeaderCell,
} from "../components/spreadsheet"
import YearPicker from "../components/year-picker"

interface BudgetProps {}

const Budget: FC<BudgetProps> = () => {
  const data = [
    {
      category: "Food",
      jan: 100,
      feb: 120,
      mar: 80,
      apr: 90,
      may: 100,
      jun: 120,
      jul: 80,
      aug: 90,
      sep: 100,
      oct: 120,
      nov: 80,
      dec: 90,
    },
    {
      category: "Housing",
      jan: 2000,
      feb: 2200,
      mar: 1800,
      apr: 1900,
      may: 2000,
      jun: 2200,
      jul: 1800,
      aug: 1900,
      sep: 2000,
      oct: 2200,
      nov: 1800,
      dec: 1900,
    },
    {
      category:
        "TransportationTransportationTransportationTransportationTransportation",
      jan: 50,
      feb: 70,
      mar: 30,
      apr: 40,
      may: 50,
      jun: 70,
      jul: 30,
      aug: 40,
      sep: 50,
      oct: 70,
      nov: 30,
      dec: 40,
    },
    {
      category: "Entertainment",
      jan: 80,
      feb: 100,
      mar: 60,
      apr: 70,
      may: 80,
      jun: 100,
      jul: 60,
      aug: 70,
      sep: 80,
      oct: 100,
      nov: 60,
      dec: 70,
    },
    {
      category: "Utilities",
      jan: 130,
      feb: 150,
      mar: 110,
      apr: 120,
      may: 130,
      jun: 150,
      jul: 110,
      aug: 120,
      sep: 130,
      oct: 150,
      nov: 110,
      dec: 120,
    },
    {
      category: "Insurance",
      jan: 90,
      feb: 110,
      mar: 70,
      apr: 80,
      may: 90,
      jun: 110,
      jul: 70,
      aug: 80,
      sep: 90,
      oct: 110,
      nov: 70,
      dec: 80,
    },
    {
      category: "Medical",
      jan: 70,
      feb: 90,
      mar: 50,
      apr: 60,
      may: 70,
      jun: 90,
      jul: 50,
      aug: 60,
      sep: 70,
      oct: 90,
      nov: 50,
      dec: 60,
    },
    {
      category: "Savings",
      jan: 200,
      feb: 250,
      mar: 150,
      apr: 180,
      may: 200,
      jun: 250,
      jul: 150,
      aug: 180,
      sep: 200,
      oct: 250,
      nov: 150,
      dec: 180,
    },
    {
      category: "Debt",
      jan: 100,
      feb: 120,
      mar: 80,
      apr: 90,
      may: 100,
      jun: 120,
      jul: 80,
      aug: 90,
      sep: 100,
      oct: 120,
      nov: 80,
      dec: 90,
    },
    {
      category: "Other",
      jan: 50,
      feb: 70,
      mar: 30,
      apr: 40,
      may: 50,
      jun: 70,
      jul: 30,
      aug: 40,
      sep: 50,
      oct: 70,
      nov: 30,
      dec: 40,
    },
    // add more rows here
  ]

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
            {data.map((row, rowIndex) => (
              <SpreadsheetRow key={row.category}>
                <SpreadsheetCell
                  className="sticky left-0 z-10"
                  inputType="text"
                >
                  {row.category}
                </SpreadsheetCell>
                <SpreadsheetCell>{row.jan}</SpreadsheetCell>
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
          </SpreadsheetBody>
        </Spreadsheet>
      </div>
    </>
  )
}

export default Budget
