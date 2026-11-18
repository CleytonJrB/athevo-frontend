"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { CheckCircle2, Dumbbell, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { appToast } from "@/lib/toast"
import {
  acceptStudentInvitation,
  lookupStudentInvitation,
} from "@/services/students-service"

export function AcceptStudentInvitationForm() {
  const router = useRouter()
  const [token] = useState<string | null>(() =>
    typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search).get("token") ?? "",
  )
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

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
      appToast.success(
        "Convite aceito",
        "Seu acesso foi ativado. Entre com sua conta para continuar.",
      )
      router.replace("/login")
    },
  })

  function submit() {
    const requiresSetup = invitationQuery.data?.requiresAccountSetup === true
    if (requiresSetup && password.length < 8) {
      setValidationError("A senha deve ter pelo menos 8 caracteres.")
      return
    }
    if (requiresSetup && password !== passwordConfirmation) {
      setValidationError("As senhas devem ser iguais.")
      return
    }
    if (requiresSetup && !acceptedTerms) {
      setValidationError("Aceite os termos para continuar.")
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

  return (
    <main className="grid min-h-dvh w-full place-items-center bg-background px-4 py-8 text-on-surface sm:px-6 sm:py-12">
      <section className="mx-auto w-full max-w-md rounded-lg border border-outline-variant bg-surface-container-low p-6 shadow-2xl sm:p-8">
        <Link href="/" className="mb-8 flex items-center gap-3 font-semibold text-primary-container">
          <span className="flex size-9 items-center justify-center rounded-md border border-primary-container/30 bg-primary-container/10">
            <Dumbbell aria-hidden="true" className="size-5" />
          </span>
          Athevo
        </Link>

        {token === null ? (
          <div className="flex min-h-48 items-center justify-center" aria-label="Carregando convite">
            <Loader2 aria-hidden="true" className="size-7 animate-spin text-primary-container" />
          </div>
        ) : !token || invitationQuery.isError ? (
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Convite indisponível</h1>
            <p className="text-sm leading-6 text-on-surface-variant">
              Este convite é inválido, expirou ou já foi utilizado. Solicite um novo convite à academia.
            </p>
            <Button href="/login" variant="outline" className="w-full">Ir para o login</Button>
          </div>
        ) : invitationQuery.isPending ? (
          <div className="flex min-h-48 items-center justify-center" aria-label="Carregando convite">
            <Loader2 aria-hidden="true" className="size-7 animate-spin text-primary-container" />
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-primary-container/10 text-primary-container">
                <CheckCircle2 aria-hidden="true" className="size-5" />
              </span>
              <h1 className="text-2xl font-semibold">Aceitar convite</h1>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                Você foi convidado para acessar <strong className="text-on-surface">{invitationQuery.data.academyName}</strong>.
              </p>
            </div>

            {invitationQuery.data.requiresAccountSetup && (
              <div className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="invitation-password">Crie uma senha</FieldLabel>
                  <Input
                    id="invitation-password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="invitation-password-confirmation">Confirme a senha</FieldLabel>
                  <Input
                    id="invitation-password-confirmation"
                    type="password"
                    autoComplete="new-password"
                    value={passwordConfirmation}
                    onChange={(event) => setPasswordConfirmation(event.target.value)}
                  />
                </Field>
                <label className="flex cursor-pointer items-start gap-3 text-sm text-on-surface-variant">
                  <Checkbox
                    checked={acceptedTerms}
                    className="mt-0.5"
                    onCheckedChange={setAcceptedTerms}
                  />
                  <span>Li e aceito os Termos de Uso e a Política de Privacidade.</span>
                </label>
              </div>
            )}

            {(validationError || acceptanceMutation.isError) && (
              <FieldError>{validationError ?? "Não foi possível aceitar o convite. Tente novamente."}</FieldError>
            )}

            <Button
              type="button"
              disabled={acceptanceMutation.isPending}
              onClick={submit}
              className="w-full bg-primary-container font-semibold text-black hover:bg-primary-container/90"
            >
              {acceptanceMutation.isPending && <Loader2 aria-hidden="true" className="animate-spin" />}
              {acceptanceMutation.isPending ? "Ativando..." : "Ativar meu acesso"}
            </Button>
          </div>
        )}
      </section>
    </main>
  )
}
