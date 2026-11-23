import axios from "axios"

import type { CurrentSubscription } from "@/types/subscription"

export async function getCurrentSubscription(signal?: AbortSignal) {
  const response = await axios.get<CurrentSubscription>(
    "/api/subscription/current",
    { signal },
  )

  return response.data
}
