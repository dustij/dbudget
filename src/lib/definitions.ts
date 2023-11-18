type BudgetModel = {
  year: number
  amounts: AmountsModel[]
}

type AmountsModel = {
  parent: CategoryParent
  categories: {
    id: string
    name: string
    parent?: CategoryParent
    monthlyAmounts: number[]
  }[]
}

type ReducedData = {
  [year: string]: {
    [categoryId: string]: {
      name: string
      parent: CategoryParent
      monthlyAmounts: number[]
    }
  }
}

type CategoryParent =
  | "income"
  | "fixed"
  | "variable"
  | "discretionary"
  | "obligation"
  | "leakage"
  | "savings"
