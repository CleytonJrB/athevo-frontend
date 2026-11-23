export interface CurrentSubscription {
  id: string
  planId: string | null
  planCode: string | null
  planName: string | null
  status: string
  trialStartedAt: string | null
  trialEndsAt: string | null
  currentPeriodStartedAt: string | null
  currentPeriodEndsAt: string | null
  accessEndsAt: string | null
  hasAccess: boolean
}
