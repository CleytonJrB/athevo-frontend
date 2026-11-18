"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Check, CircleAlert, Info, Loader2 } from "lucide-react"

import LogoSimple from "@/components/icons/logo-simple"
import { PasswordToggle } from "@/components/layout/password-toggle"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { appToast } from "@/lib/toast"
import {
  acceptStudentInvitation,
  lookupStudentInvitation,
} from "@/services/students-service"

type InvitationView =
  | "existing"
  | "new"
  | "loading"
  | "processing"
  | "accepted"
  | "unavailable"

export function AcceptStudentInvitationForm() {
  const router = useRouter()
  const [token] = useState<string | null>(() =>
    typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search).get("token") ?? "",
  )
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    if (token !== null) window.history.replaceState(null, "", "/accept-invitation")
  }, [token])

  const invitationQuery = useQuery({
    enabled: Boolean(token),
    queryKey: ["student-invitation", token],
    queryFn: () => lookupStudentInvitation(token ?? ""),
    retry: false,
  })

  const acceptanceMutation = useMutation({
    mutationFn: acceptStudentInvitation,
    meta: { skipGlobalErrorToast: true },
    onSuccess: () => {
      setAccepted(true)
      appToast.success(
        "Convite aceito",
        "Seu acesso foi ativado. Entre com sua conta para continuar.",
      )
    },
  })

  function submit() {
    const requiresSetup = currentView === "new"
    if (requiresSetup && password.length < 8) {
      setValidationError("A senha deve ter pelo menos 8 caracteres.")
      return
    }
    if (requiresSetup && password !== passwordConfirmation) {
      setValidationError("As senhas informadas não coincidem.")
      return
    }
    if (requiresSetup && !acceptedTerms) {
      setValidationError("É necessário aceitar os termos para prosseguir.")
      return
    }

    setValidationError(null)

    acceptanceMutation.mutate({
      acceptedTerms: requiresSetup ? acceptedTerms : false,
      password: requiresSetup ? password : undefined,
      passwordConfirmation: requiresSetup ? passwordConfirmation : undefined,
      token: token ?? "",
    })
  }

  const actualView: InvitationView =
    token === null
      ? "loading"
      : accepted
        ? "accepted"
        : !token
          ? "unavailable"
          : invitationQuery.isPending
            ? "loading"
            : invitationQuery.isError || !invitationQuery.data
              ? "unavailable"
              : acceptanceMutation.isPending
              ? "processing"
                : invitationQuery.data.requiresAccountSetup
                  ? "new"
                  : "existing"
  const currentView = actualView
  const academyName = invitationQuery.data?.academyName ?? "Iron Fitness Center"

  return (
    <main className="relative flex min-h-dvh w-full items-center justify-center bg-[#08090A] p-4 text-[#F2F2F2] selection:bg-primary-container selection:text-[#08090A]">
      <section className="w-full max-w-115 rounded-lg border border-[#34352F] bg-[#181B1A] p-6 text-left transition-all duration-200 sm:p-8">
        <BrandHeader />

        {currentView === "loading" && <InvitationLoading />}
        {currentView === "accepted" && (
          <InvitationAccepted
            academyName={academyName}
            onLogin={() => router.replace("/login")}
          />
        )}
        {currentView === "unavailable" && <InvitationUnavailable />}
        {currentView === "processing" && (
          <InvitationProcessing academyName={academyName} />
        )}
        {currentView === "existing" && (
          <InvitationContent academyName={academyName}>
            <ExistingAccountAction
              pending={acceptanceMutation.isPending}
              error={acceptanceMutation.isError}
              onSubmit={submit}
            />
          </InvitationContent>
        )}
        {currentView === "new" && (
          <InvitationContent
            academyName={academyName}
            description="Crie uma senha segura para concluir seu cadastro de aluno."
          >
            <AccountSetupForm
              password={password}
              passwordConfirmation={passwordConfirmation}
              showPassword={showPassword}
              showPasswordConfirmation={showPasswordConfirmation}
              acceptedTerms={acceptedTerms}
              validationError={validationError}
              pending={acceptanceMutation.isPending}
              mutationError={acceptanceMutation.isError}
              onPasswordChange={(value) => {
                setPassword(value)
                setValidationError(null)
              }}
              onPasswordConfirmationChange={(value) => {
                setPasswordConfirmation(value)
                setValidationError(null)
              }}
              onTogglePassword={() => setShowPassword((value) => !value)}
              onTogglePasswordConfirmation={() =>
                setShowPasswordConfirmation((value) => !value)
              }
              onAcceptedTermsChange={(value) => {
                setAcceptedTerms(value)
                setValidationError(null)
              }}
              onSubmit={submit}
            />
          </InvitationContent>
        )}
      </section>
    </main>
  )
}

function BrandHeader() {
  return (
    <Link
      href="/"
      aria-label="Ir para o início da Athevo"
      className="mb-6 flex w-fit items-center gap-3 text-[17px] font-semibold tracking-tight text-primary-container"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-primary-container bg-transparent">
        <LogoSimple className="h-5 w-auto" />
      </span>
      Athevo
    </Link>
  )
}

function InvitationContent({
  academyName,
  children,
  description,
}: {
  academyName: string
  children: ReactNode
  description?: string
}) {
  return (
    <div className="flex flex-col">
      <StatusIcon />
      <h1 className="mb-2 text-xl font-semibold tracking-tight text-[#F2F2F2]">
        Aceitar convite
      </h1>
      <p className="mb-6 text-sm leading-relaxed text-[#A1A1AA]">
        Você foi convidado para acessar{" "}
        <strong className="font-medium text-[#F2F2F2]">{academyName}</strong>.
        {description && ` ${description}`}
      </p>
      {children}
    </div>
  )
}

function StatusIcon({ accepted = false }: { accepted?: boolean }) {
  return (
    <span
      className={`mb-5 flex size-9 shrink-0 items-center justify-center rounded-full border ${
        accepted
          ? "border-primary-container bg-primary-container text-[#08090A]"
          : "border-primary-container/30 bg-primary-container/10 text-primary-container"
      }`}
    >
      <Check
        aria-hidden="true"
        className={accepted ? "size-5 stroke-3" : "size-4 stroke-3"}
      />
    </span>
  )
}

function ExistingAccountAction({
  pending,
  error,
  onSubmit,
}: {
  pending: boolean
  error: boolean
  onSubmit: () => void
}) {
  return (
    <>
      <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-[#34352F] bg-[#08090A] p-3.5">
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#A1A1AA]" />
        <p className="text-xs leading-normal text-[#A1A1AA]">
          O acesso será associado à sua conta existente cadastrada na plataforma.
        </p>
      </div>
      {error && (
        <FieldError className="mb-4 text-xs">
          Não foi possível aceitar o convite. Tente novamente.
        </FieldError>
      )}
      <PrimaryAction pending={pending} onClick={onSubmit}>
        Ativar meu acesso
      </PrimaryAction>
    </>
  )
}

interface AccountSetupFormProps {
  acceptedTerms: boolean
  mutationError: boolean
  password: string
  passwordConfirmation: string
  pending: boolean
  showPassword: boolean
  showPasswordConfirmation: boolean
  validationError: string | null
  onAcceptedTermsChange: (value: boolean) => void
  onPasswordChange: (value: string) => void
  onPasswordConfirmationChange: (value: string) => void
  onSubmit: () => void
  onTogglePassword: () => void
  onTogglePasswordConfirmation: () => void
}

function AccountSetupForm({
  acceptedTerms,
  mutationError,
  password,
  passwordConfirmation,
  pending,
  showPassword,
  showPasswordConfirmation,
  validationError,
  onAcceptedTermsChange,
  onPasswordChange,
  onPasswordConfirmationChange,
  onSubmit,
  onTogglePassword,
  onTogglePasswordConfirmation,
}: AccountSetupFormProps) {
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <InvitationPasswordField
        id="invitation-password"
        label="Crie uma senha"
        placeholder="Mínimo de 8 caracteres"
        value={password}
        shown={showPassword}
        onChange={onPasswordChange}
        onToggle={onTogglePassword}
      />
      <InvitationPasswordField
        id="invitation-password-confirmation"
        label="Confirme sua senha"
        placeholder="Digite novamente a senha"
        value={passwordConfirmation}
        shown={showPasswordConfirmation}
        onChange={onPasswordConfirmationChange}
        onToggle={onTogglePasswordConfirmation}
      />

      <div className="pt-1">
        <label className="flex cursor-pointer items-start gap-2.5">
          <Checkbox
            checked={acceptedTerms}
            onCheckedChange={onAcceptedTermsChange}
            aria-label="Aceitar os Termos de Uso e a Política de Privacidade"
            className="mt-0.5 border-[#34352F] bg-[#08090A]"
          />
          <span className="text-xs leading-snug text-[#A1A1AA]">
            Li e aceito os{" "}
            <span className="text-[#F2F2F2] underline underline-offset-2">
              Termos de Uso
            </span>{" "}
            e a{" "}
            <span className="text-[#F2F2F2] underline underline-offset-2">
              Política de Privacidade
            </span>
            .
          </span>
        </label>
      </div>

      {(validationError || mutationError) && (
        <FieldError className="text-xs">
          {validationError ?? "Não foi possível aceitar o convite. Tente novamente."}
        </FieldError>
      )}

      <PrimaryAction pending={pending} type="submit">
        Criar conta e ativar acesso
      </PrimaryAction>
    </form>
  )
}

function InvitationPasswordField({
  id,
  label,
  placeholder,
  shown,
  value,
  onChange,
  onToggle,
}: {
  id: string
  label: string
  placeholder: string
  shown: boolean
  value: string
  onChange: (value: string) => void
  onToggle: () => void
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[#A1A1AA]">
        {label}
      </span>
      <span className="relative block">
        <Input
          id={id}
          type={shown ? "text" : "password"}
          autoComplete="new-password"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-10 rounded-lg border-[#34352F] bg-[#08090A] px-3.5 pr-11 text-sm text-[#F2F2F2] shadow-none placeholder:text-[#A1A1AA]/50 focus-visible:border-primary-container focus-visible:ring-1 focus-visible:ring-primary-container"
        />
        <PasswordToggle
          shown={shown}
          onToggle={onToggle}
          className="text-[#A1A1AA] hover:text-[#F2F2F2]"
        />
      </span>
    </label>
  )
}

function PrimaryAction({
  children,
  pending,
  onClick,
  type = "button",
}: {
  children: ReactNode
  pending: boolean
  onClick?: () => void
  type?: "button" | "submit"
}) {
  return (
    <Button
      type={type}
      disabled={pending}
      onClick={onClick}
      className="mt-2 h-11 w-full rounded-lg bg-primary-container px-4 text-sm font-semibold text-[#08090A] hover:bg-[#EAB308] focus-visible:ring-primary-container disabled:bg-primary-container/60 disabled:text-[#08090A]"
    >
      {pending && <Loader2 aria-hidden="true" className="animate-spin" />}
      {pending ? "Ativando..." : children}
    </Button>
  )
}

function InvitationLoading() {
  return (
    <div
      className="flex min-h-44 flex-col items-center justify-center py-8"
      aria-label="Validando convite"
    >
      <Loader2 aria-hidden="true" className="mb-4 size-8 animate-spin text-primary-container" />
      <p className="text-sm font-medium text-[#A1A1AA]">Validando convite...</p>
    </div>
  )
}

function InvitationProcessing({ academyName }: { academyName: string }) {
  return (
    <InvitationContent academyName={academyName}>
      <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-[#34352F] bg-[#08090A] p-3.5">
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#A1A1AA]" />
        <p className="text-xs leading-normal text-[#A1A1AA]">
          O acesso será associado à sua conta existente.
        </p>
      </div>
      <PrimaryAction pending>Ativar meu acesso</PrimaryAction>
    </InvitationContent>
  )
}

function InvitationAccepted({
  academyName,
  onLogin,
}: {
  academyName: string
  onLogin: () => void
}) {
  return (
    <div className="flex flex-col">
      <StatusIcon accepted />
      <h1 className="mb-2 text-xl font-semibold tracking-tight text-[#F2F2F2]">
        Convite aceito!
      </h1>
      <p className="mb-6 text-sm leading-relaxed text-[#A1A1AA]">
        Seu acesso como aluno à{" "}
        <strong className="font-medium text-[#F2F2F2]">{academyName}</strong> foi
        liberado com sucesso.
      </p>
      <div className="mb-6 rounded-lg border border-[#34352F] bg-[#08090A] p-3.5 text-xs leading-relaxed text-[#A1A1AA]">
        Você já pode acessar seus treinos, horários de aula e dados financeiros pelo
        portal do aluno.
      </div>
      <Button
        type="button"
        onClick={onLogin}
        className="h-11 w-full rounded-lg bg-primary-container text-sm font-semibold text-[#08090A] hover:bg-[#EAB308]"
      >
        Entrar na Athevo
      </Button>
    </div>
  )
}

function InvitationUnavailable() {
  return (
    <div className="flex flex-col">
      <span className="mb-5 flex size-9 shrink-0 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
        <CircleAlert aria-hidden="true" className="size-4" />
      </span>
      <h1 className="mb-2 text-xl font-semibold tracking-tight text-[#F2F2F2]">
        Convite indisponível
      </h1>
      <p className="mb-6 text-sm leading-relaxed text-[#A1A1AA]">
        Este convite expirou, foi cancelado ou já foi utilizado anteriormente pela
        academia.
      </p>
      <div className="mb-6 rounded-lg border border-[#34352F] bg-[#08090A] p-3.5 text-xs leading-relaxed text-[#A1A1AA]">
        Se você acredita que isso é um engano, solicite um novo convite à recepção da
        sua academia.
      </div>
      <Button
        href="/login"
        variant="outline"
        className="h-11 w-full rounded-lg border-[#34352F] bg-[#181B1A] text-sm font-medium text-[#F2F2F2] hover:bg-[#08090A]"
      >
        Ir para o login
      </Button>
    </div>
  )
}
