type SessionUser = {
  name?: string | null
  email?: string | null
  image?: string | null
  id?: string | null
}

interface CategoryParent {
  id: number
  name: string
  categories: {
    id: number
    name: string
    monthlyAmounts: number[]
  }[]
}
