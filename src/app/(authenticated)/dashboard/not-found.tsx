import LogoSimple from "@/components/icons/logo-simple"

import { NotFoundActions } from "./_components/not-found-actions"

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[calc(100svh-6.5rem)] flex-1 flex-col bg-background">
      <div className="relative isolate flex flex-1 items-center justify-center overflow-hidden px-6 py-12">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 opacity-50 [background-image:linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        />
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -z-10 h-72 w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-container/5 blur-[120px]"
        />

        <section className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
          <div
            aria-label="Erro 404"
            className="mb-7 flex select-none items-center justify-center"
          >
            <span className="bg-linear-to-b from-zinc-200 via-zinc-400 to-zinc-700/50 bg-clip-text text-[5.5rem] leading-none font-extrabold tracking-tighter text-transparent sm:text-[7.5rem]">
              4
            </span>

            <div className="relative mx-3 flex size-20 items-center justify-center sm:mx-5 sm:size-28">
              <div className="absolute inset-0 rotate-45 rounded-2xl border border-primary-container/30 bg-surface shadow-[0_0_35px_rgba(250,204,21,0.15)]">
                <div className="absolute inset-5 rounded-xl border border-surface-container-high bg-surface-container-lowest" />
              </div>
              <LogoSimple
                width={48}
                height={42}
                className="relative z-10 h-auto w-9 object-contain sm:w-12"
              />
            </div>

            <span className="bg-linear-to-b from-zinc-200 via-zinc-400 to-zinc-700/50 bg-clip-text text-[5.5rem] leading-none font-extrabold tracking-tighter text-transparent sm:text-[7.5rem]">
              4
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-on-surface">
            Página não encontrada
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-on-surface-variant">
            O endereço que você tentou acessar não existe ou foi movido.
            Verifique o link ou retorne à página inicial.
          </p>

          <NotFoundActions />
        </section>
      </div>
    </div>
  )
}
