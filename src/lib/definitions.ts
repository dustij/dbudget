interface IBudget {
  categories: ICategory[] | []
  yearData: IYearData[] | []
}

interface ICategory {
  id: string
  name: string
  userId: string
  parent: CategoryParent
  ruleId: string | null
  createdAt: Date
  updatedAt: Date
}

interface IYearData {
  year: number
  amounts: IAmounts
}

interface IAmounts {
  parent: CategoryParent
  categories: IExtendedCategory[]
}

interface IExtendedCategory extends ICategory {
  monthlyAmounts: number[]
}

type CategoryParent =
  | "income"
  | "fixed"
  | "variable"
  | "discretionary"
  | "obligation"
  | "leakage"
  | "savings"
