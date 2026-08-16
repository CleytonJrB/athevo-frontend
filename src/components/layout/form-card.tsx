interface FormCardProps {
  title: string
  description: string
  children: React.ReactNode
}

export function FormCard({ title, description, children }: FormCardProps) {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 rounded-full bg-yellow-400/5 blur-[64px]" />

      <div className="relative z-10 mx-auto w-full rounded-xl border border-white/10 bg-linear-to-br from-white/6 via-zinc-950/65 to-zinc-950/50 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:p-7">
        <div className="mb-6">
          <h2 className="text-3xl font-semibold tracking-tight text-white">{title}</h2>
          <p className="mt-1.5 text-xs leading-5 text-zinc-500">{description}</p>
        </div>
        {children}
      </div>
    </>
  )
}
