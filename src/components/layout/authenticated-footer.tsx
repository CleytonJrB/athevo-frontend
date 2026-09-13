import LogoSimple from "@/components/icons/logo-simple"

export function AuthenticatedFooter() {
  return (
    <footer className="flex h-10 shrink-0 items-center justify-between border-t border-border px-6 text-[11px] text-on-surface-variant md:px-8">
      <span className="hidden items-center gap-2 sm:flex">
        <LogoSimple width={14} height={12} className="h-3 w-auto shrink-0" />
        Athevo Gym Management Platform © 2026. Todos os direitos reservados.
      </span>
    </footer>
  )
}
