import type { StudentInvoice } from "@/types/student-finance"
import { cn } from "@/lib/utils"

import { getInvoiceStatusLabel, getInvoiceTone } from "./my-finance-utils"

export function InvoiceStatusBadge({ invoice }: { invoice: StudentInvoice }) {
  const tone = getInvoiceTone(invoice)

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tone === "paid" && "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
        tone === "open" && "border-blue-500/30 bg-blue-500/10 text-blue-400",
        tone === "partial" && "border-amber-500/30 bg-amber-500/10 text-amber-400",
        tone === "overdue" && "border-rose-500/30 bg-rose-500/10 text-rose-400",
        tone === "cancelled" && "border-zinc-600/40 bg-zinc-700/20 text-zinc-400",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full bg-current",
          tone === "cancelled" && "hidden",
        )}
      />
      {getInvoiceStatusLabel(invoice)}
    </span>
  )
}
