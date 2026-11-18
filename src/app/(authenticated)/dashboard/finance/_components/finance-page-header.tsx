import { Plus, Settings2 } from "lucide-react"

import { AuthenticatedCommonTitle } from "@/components/layout/authenticated-common-title"
import { Button } from "@/components/ui/button"

interface FinancePageHeaderProps {
  onGenerateInvoices: () => void
  onOpenSettings: () => void
}

export function FinancePageHeader({
  onGenerateInvoices,
  onOpenSettings,
}: FinancePageHeaderProps) {
  return (
    <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 -z-10 size-64 rounded-full bg-primary-container/5 blur-[80px]"
      />

      <AuthenticatedCommonTitle
        title="Financeiro dos Alunos"
        subTitle="Gestão de cobranças, recebíveis e conciliação de planos."
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onOpenSettings}
          className="h-10 border-border bg-transparent px-4 text-on-surface hover:bg-surface-container"
        >
          <Settings2 aria-hidden="true" />
          Configurações
        </Button>
        <Button
          type="button"
          onClick={onGenerateInvoices}
          className="h-10 rounded-md bg-primary-container px-5 font-bold text-black hover:bg-primary-container hover:shadow-[0_0_20px_rgba(250,204,21,0.35)]"
        >
          <Plus aria-hidden="true" />
          Gerar faturas
        </Button>
      </div>
    </div>
  )
}

