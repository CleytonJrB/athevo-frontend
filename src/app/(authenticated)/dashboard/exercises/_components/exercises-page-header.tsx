import { Plus } from "lucide-react"

import { AuthenticatedCommonTitle } from "@/components/layout/authenticated-common-title"
import { Button } from "@/components/ui/button"

export function ExercisesPageHeader() {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <AuthenticatedCommonTitle
        title="Biblioteca de Exercícios"
        subTitle="Base de dados para montagem de treinos."
      />

      <Button
        type="button"
        className="h-10 self-start rounded-md bg-primary-container px-6 font-bold text-black hover:bg-primary-container hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] md:self-auto"
      >
        <Plus aria-hidden="true" className="size-5" />
        Novo Exercício
      </Button>
    </div>
  )
}
