"use client"

import React from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"

import { login } from "@/lib/api/auth"
import { cn } from "@/lib/utils"
import { loginSchema, type LoginFormData } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import GoogleLogo from "@/components/icons/google-logo"

export function LoginForm({
  className,
  ...props
}: Omit<React.ComponentProps<"form">, "onSubmit">) {
  const hasCustomAuth = false

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })
  const loginMutation = useMutation({ mutationFn: login })

  async function onSubmit(data: LoginFormData) {
    await loginMutation.mutate(data)
    reset()
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-start gap-1">
          <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>

          <p className="text-sm text-muted-foreground">
            Acesse sua conta para gerenciar seu negócio fitness.
          </p>
        </div>

        <Field data-invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          <FieldError id="email-error" errors={[errors.email]} />
        </Field>

        <Field data-invalid={Boolean(errors.password)}>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Senha</FieldLabel>

            <Button
              href="/register"
              variant="link"
              className="ml-auto text-[0.8rem] underline-offset-4 hover:underline"
            >
              Esqueceu a senha?
            </Button>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
          />
          <FieldError id="password-error" errors={[errors.password]} />
        </Field>

        {loginMutation.isError ? (
          <p role="alert" className="text-sm text-destructive">
            Não foi possível entrar. Tente novamente.
          </p>
        ) : null}
        {loginMutation.isSuccess ? (
          <p role="status" className="text-sm text-emerald-400">
            Login simulado com sucesso. A API ainda não está conectada.
          </p>
        ) : null}

        <Field>
          <Button
            type="submit"
            size="lg"
            className="rounded-md"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Entrando..." : "Login"}
          </Button>
        </Field>

        {hasCustomAuth ? (
          <>
            <FieldSeparator>Ou conectar com</FieldSeparator>
            <Button variant="outline" type="button">
              <GoogleLogo />
              Continuar com Google
            </Button>
          </>
        ) : null}

        <Field>
          <FieldDescription className="text-center">
            Não tem uma conta?{" "}

            <Button
              href="/register"
              variant="link"
              className="underline underline-offset-4"
            >
              Criar conta
            </Button>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
