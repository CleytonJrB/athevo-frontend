"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, House } from "lucide-react"

import { Button } from "@/components/ui/button"

export function NotFoundActions() {
  const router = useRouter()

  function navigateBack() {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push("/dashboard")
  }

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      <Button
        href="/dashboard"
        size="lg"
        className="bg-primary-container px-5 font-semibold text-zinc-950 shadow-md shadow-primary-container/20 hover:scale-[1.02] hover:bg-yellow-500"
      >
        <House aria-hidden="true" />
        Voltar à Visão Geral
      </Button>
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={navigateBack}
        className="border-outline-variant bg-surface text-on-surface hover:border-outline hover:bg-surface-container-high"
      >
        <ArrowLeft aria-hidden="true" />
        Página anterior
      </Button>
    </div>
  )
}
