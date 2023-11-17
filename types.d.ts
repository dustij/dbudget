type SessionUser = {
  name?: string | null
  email?: string | null
  image?: string | null
  id?: string | null
}

interface AmountsModel {
  parent: CategoryParent
  categories: {
    id: string
    name: string
    parent?: CategoryParent
    monthlyAmounts: number[]
  }[]
}

type CategoryParent =
  | "income"
  | "fixed"
  | "variable"
  | "discretionary"
  | "obligation"
  | "leakage"
  | "savings"
