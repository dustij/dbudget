type SessionUser = {
  name?: string | null
  email?: string | null
  image?: string | null
  id?: string | null
}

interface AmountsModel {
  parent: string
  categories: {
    id: number | string
    name: string
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
