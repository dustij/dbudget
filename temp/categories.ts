export interface CategoryParent {
  id: number
  name: string
  categories: {
    id: number
    name: string
    monthlyAmounts: number[]
  }[]
}
