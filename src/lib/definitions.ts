interface IBudgetData {
  categories: ICategory[] | []
  allYearsData: IYearData[] | []
}

interface ICategory {
  id: string
  name: string
  userId: string
  parent: CategoryParent
  ruleId?: string | null
  createdAt?: Date | string
  updatedAt?: Date | string
}

interface IYearData {
  year: number
  budgets: IBudget[]
}

interface IBudget {
  parent: CategoryParent
  categoriesData: IExtendedCategory[]
}

interface IExtendedCategory extends ICategory {
  monthlyAmounts: IMonthlyAmount[]
}

interface IMonthlyAmount {
  id: string | null
  amount: number
}

type CategoryParent =
  | "income"
  | "fixed"
  | "variable"
  | "discretionary"
  | "obligation"
  | "leakage"
  | "savings"

interface ILog {
  [key: number]: string // key is a timestamp in milliseconds
}
