export interface MembershipPlanPrice {
  amount: number
  billingInterval: "monthly" | "yearly"
  currency: string
  id: string
  intervalCount: number
  validFrom: string
}

export interface MembershipPlan {
  active: boolean
  code: string
  description?: string | null
  id: string
  name: string
  prices: MembershipPlanPrice[]
}
