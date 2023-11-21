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
  createdAt: Date | string
  updatedAt: Date | string
}

interface IYearData {
  year: number
  amounts: IAmount[]
}

interface IAmount {
  parent: CategoryParent
  categories: IExtendedCategory[]
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

interface ICategoryRef {
  input: HTMLInputElement | null
  category: ICategory | null
}
