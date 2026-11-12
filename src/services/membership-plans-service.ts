import axios, { isAxiosError } from "axios"

import type { MembershipPlan } from "@/types/membership-plan"

export async function listActiveMembershipPlans(signal?: AbortSignal) {
  try {
    const response = await axios.get<MembershipPlan[]>("/api/membership-plans", {
      params: { active: true },
      signal,
    })
    return response.data
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.status === 403
          ? "Seu perfil não tem acesso aos planos desta academia."
          : "Não foi possível carregar os planos da academia.",
      )
    }

    throw error
  }
}
