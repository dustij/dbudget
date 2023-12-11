interface IBudgetData {
  categories: ICategory[] | []
  budgetsByYear: IYearBudget[] | []
}

interface ICategory {
  id?: string | null
  name: string
  userId: string
  parent: CategoryParent
  ruleId?: string | null
  createdAt?: Date | string
  updatedAt?: Date | string
}

interface IYearBudget {
  year: number
  budgetsByParent: IParentBudget[]
}

interface IParentBudget {
  parent: CategoryParent
  budgetsByCategory: ICategoryBudget[]
}

interface ICategoryBudget extends ICategory {
  monthlyAmounts: IMonthlyAmount[]
}

interface IMonthlyAmount {
  id?: string | null
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

interface IJournalData {
  categories: ICategory[] | []
  journalsByYear: IYearJournal[] | []
}

interface IYearJournal {
  year: number
  journals: IJournal[]
}

interface IJournal {
  id?: string | null
  date: Date | string
  amount: number
  categoryId: string
  notes?: string | null
  createdAt?: Date | string
  updatedAt?: Date | string
}
