import type { FC } from "react"
import { Td, Th } from "../components/table-elements"

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
    <div>
      <table className="w-full min-w-[1000px] table-fixed border-separate border-spacing-0 text-[14px]">
        <thead className="sticky top-0 z-30 h-[33px] bg-white">
          <tr>
            <Th className="sticky left-0 bg-white text-left">Category</Th>
            <Th>Jan</Th>
            <Th>Feb</Th>
            <Th>Mar</Th>
            <Th>Apr</Th>
            <Th>May</Th>
            <Th>Jun</Th>
            <Th>Jul</Th>
            <Th>Aug</Th>
            <Th>Sep</Th>
            <Th>Oct</Th>
            <Th>Nov</Th>
            <Th className="border-r-0">Dec</Th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <Td
                className="sticky left-0 z-10 bg-white text-left"
                inputType="text"
              >
                {row.category}
              </Td>
              <Td inputType="number">{row.jan}</Td>
              <Td inputType="number">{row.feb}</Td>
              <Td inputType="number">{row.mar}</Td>
              <Td inputType="number">{row.apr}</Td>
              <Td inputType="number">{row.may}</Td>
              <Td inputType="number">{row.jun}</Td>
              <Td inputType="number">{row.jul}</Td>
              <Td inputType="number">{row.aug}</Td>
              <Td inputType="number">{row.sep}</Td>
              <Td inputType="number">{row.oct}</Td>
              <Td inputType="number">{row.nov}</Td>
              <Td className="border-r-0" inputType="number">
                {row.dec}
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Budget
