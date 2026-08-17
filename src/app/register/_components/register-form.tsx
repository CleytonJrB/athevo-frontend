"use client"

import { useState } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation } from "@tanstack/react-query"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Rocket,
} from "lucide-react"
import { Controller, useForm, useWatch, type FieldPath } from "react-hook-form"

import { register as registerAccount } from "@/lib/api/auth"
import { cn } from "@/lib/utils"
import {
  registerSchema,
  type RegisterFormData,
} from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup } from "@/components/ui/radio-group"
import { FormCard } from "@/components/layout/form-card"
import { PasswordToggle } from "@/components/layout/password-toggle"
import { SearchableOptionsInput } from "@/components/layout/searchable-options-input"
import { SelectCard } from "@/components/layout/select-card"
import { SelectInput } from "@/components/layout/select-input"
import {
  Stepper,
  StepperCompletedContent,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperLabel,
  StepperList,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper"
import { formatDocument, formatPhone } from "@/lib/formats"
import {
  areaCodeOptions,
  completionCards,
  gymTypeOptions,
  stateOptions,
  studentRangeOptions,
} from "@/app/register/_mocks/register-form"

import Logo from "@/components/icons/logo"

const steps = ["Conta", "Academia", "Finalizar"]

const fieldsByStep: Array<Array<FieldPath<RegisterFormData>>> = [
  [
    "firstName",
    "lastName",
    "email",
    "password",
    "passwordConfirmation",
    "acceptedTerms",
  ],
  [
    "gymName",
    "gymType",
    "studentRange",
    "document",
    "areaCode",
    "contactPhone",
    "country",
    "state",
  ],
  ["start-work-space-type"],
]

export function RegisterForm() {
  const [step, setStep] = useState(0)
  const [maxVisitedStep, setMaxVisitedStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      acceptedTerms: false,
      gymName: "",
      gymType: "",
      studentRange: "",
      document: "",
      areaCode: "",
      contactPhone: "",
      country: "BR",
      state: "",
      "start-work-space-type": "",
    },
  })

  const registerMutation = useMutation({
    mutationFn: registerAccount,
    onSuccess: () => setStep(steps.length),
  })

  const contactPhone = useWatch({ control, name: "contactPhone" })
  const document = useWatch({ control, name: "document" })
  const areaCode = useWatch({ control, name: "areaCode" })
  const state = useWatch({ control, name: "state" })

  async function goToNextStep() {
    const currentFields = fieldsByStep[step]
    if (currentFields && !(await trigger(currentFields, { shouldFocus: true }))) {
      return
    }

    const nextStep = Math.min(step + 1, steps.length - 1)
    setStep(nextStep)
    setMaxVisitedStep((current) => Math.max(current, nextStep))
  }

  function onSubmit(data: RegisterFormData) {
    registerMutation.mutate(data)
  }

  return (
    <form className="mx-auto w-full max-w-2xl px-12 lg:px-0" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Stepper
        count={steps.length}
        step={step}
        linear
        onStepChange={({ step: requestedStep }) => {
          if (requestedStep <= maxVisitedStep) setStep(requestedStep)
        }}
      >
        <StepperList className="mx-auto w-full">
          {steps.map((title, index) => (
            <StepperItem key={title} index={index}>
              <StepperTrigger className="flex flex-row gap-2.5 items-center">
                <StepperIndicator
                  className={cn(
                    "border border-yellow-400/20 bg-zinc-900 size-9",
                    index < step && "border-emerald-500 bg-emerald-500/20 text-black",
                    index === step && "border-yellow-400 bg-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.25)]"
                  )}
                >
                  {index < step ? <Check className="size-4 text-emerald-500" /> : index >= 0 && index < 9 ? `0${index + 1}` : index + 1}
                </StepperIndicator>

                <StepperLabel>
                  <StepperTitle
                    className={cn(
                      "text-lg text-zinc-500",
                      index <= step && "text-zinc-200"
                    )}
                  >
                    {title}
                  </StepperTitle>
                </StepperLabel>
              </StepperTrigger>

              {index < steps.length - 1 ? (
                <StepperSeparator className="mx-2 mt-3.5 bg-yellow-400/30" />
              ) : null}
            </StepperItem>
          ))}
        </StepperList>

        <StepperContent index={0} className="mt-7">
          <FormCard
            title="Crie sua conta"
            description="Comece sua jornada de alta performance na Athevo."
          >
            <FieldGroup className="grid gap-4 md:grid-cols-2">
              <Field data-invalid={Boolean(errors.firstName)}>
                <FieldLabel htmlFor="first-name">Nome</FieldLabel>
                <Input
                  id="first-name"
                  autoComplete="given-name"
                  placeholder="Seu nome"
                  aria-invalid={Boolean(errors.firstName)}
                  {...register("firstName")}
                />
                <FieldError errors={[errors.firstName]} />
              </Field>

              <Field data-invalid={Boolean(errors.lastName)}>
                <FieldLabel htmlFor="last-name">Sobrenome</FieldLabel>
                <Input
                  id="last-name"
                  autoComplete="family-name"
                  placeholder="Seu sobrenome"
                  aria-invalid={Boolean(errors.lastName)}
                  {...register("lastName")}
                />
                <FieldError errors={[errors.lastName]} />
              </Field>

              <Field className="md:col-span-2" data-invalid={Boolean(errors.email)}>
                <FieldLabel htmlFor="register-email">E-mail corporativo</FieldLabel>
                <Input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@suaacademia.com.br"
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
                <FieldError errors={[errors.email]} />
              </Field>

              <Field data-invalid={Boolean(errors.password)}>
                <FieldLabel htmlFor="register-password">Senha</FieldLabel>
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Mínimo de 8 caracteres"
                    className="pr-11"
                    aria-invalid={Boolean(errors.password)}
                    {...register("password")}
                  />
                  <PasswordToggle shown={showPassword} onToggle={() => setShowPassword((value) => !value)} />
                </div>
                <FieldError errors={[errors.password]} />
              </Field>

              <Field data-invalid={Boolean(errors.passwordConfirmation)}>
                <FieldLabel htmlFor="password-confirmation">Confirmar senha</FieldLabel>
                <div className="relative">
                  <Input
                    id="password-confirmation"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repita sua senha"
                    className="pr-11"
                    aria-invalid={Boolean(errors.passwordConfirmation)}
                    {...register("passwordConfirmation")}
                  />
                  <PasswordToggle shown={showPassword} onToggle={() => setShowPassword((value) => !value)} />
                </div>
                <FieldError errors={[errors.passwordConfirmation]} />
              </Field>

              <Field className="md:col-span-2" data-invalid={Boolean(errors.acceptedTerms)}>
                <Controller
                  name="acceptedTerms"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="accepted-terms"
                        name={field.name}
                        checked={field.value}
                        inputRef={field.ref}
                        className="mt-0.5 border-zinc-600 bg-zinc-900 data-checked:border-yellow-400 data-checked:bg-yellow-400 data-checked:text-black"
                        aria-invalid={Boolean(errors.acceptedTerms)}
                        onBlur={field.onBlur}
                        onCheckedChange={field.onChange}
                      />
                      <label
                        htmlFor="accepted-terms"
                        className="cursor-pointer text-xs leading-5 text-zinc-400"
                      >
                        Eu aceito os{" "}
                        <a href="#" className="font-medium text-yellow-400 hover:underline">Termos de Uso</a>
                        {" "}e a{" "}
                        <a href="#" className="font-medium text-yellow-400 hover:underline">Política de Privacidade</a>.
                      </label>
                    </div>
                  )}
                />
                <FieldError errors={[errors.acceptedTerms]} />
              </Field>
            </FieldGroup>

            <Button
              type="button"
              size="lg"
              className="mt-6 w-full bg-linear-to-b from-yellow-300 to-yellow-500 font-semibold text-black shadow-[0_10px_30px_rgba(250,204,21,0.12)] hover:from-yellow-200 hover:to-yellow-400"
              onClick={goToNextStep}
            >
              Continuar <ArrowRight />
            </Button>

            <p className="mt-5 text-center text-xs text-zinc-500">
              Já possui uma conta?{" "}
              <a href="/login" className="font-semibold text-yellow-400 hover:underline">Fazer login</a>
            </p>
          </FormCard>
        </StepperContent>

        <StepperContent index={1} className="mt-7">
          <FormCard
            title="Dados da academia"
            description="Precisamos desses dados para configurar seu painel de alto desempenho."
          >
            <FieldGroup className="gap-4">
              <Field data-invalid={Boolean(errors.gymName)}>
                <FieldLabel htmlFor="gym-name">Nome da academia</FieldLabel>
                <Input
                  id="gym-name"
                  autoComplete="organization"
                  placeholder="Ex.: Iron Peak Fitness"
                  aria-invalid={Boolean(errors.gymName)}
                  {...register("gymName")}
                />
                <FieldError errors={[errors.gymName]} />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field data-invalid={Boolean(errors.gymType)}>
                  <FieldLabel htmlFor="gym-type">Tipo</FieldLabel>
                  <SelectInput
                    id="gym-type"
                    aria-invalid={Boolean(errors.gymType)}
                    {...register("gymType")}
                  >
                    <option value="">Selecione...</option>
                    {gymTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </SelectInput>
                  <FieldError errors={[errors.gymType]} />
                </Field>

                <Field data-invalid={Boolean(errors.studentRange)}>
                  <FieldLabel htmlFor="student-range">Quantidade de alunos</FieldLabel>
                  <SelectInput
                    id="student-range"
                    aria-invalid={Boolean(errors.studentRange)}
                    {...register("studentRange")}
                  >
                    <option value="">Selecione...</option>
                    {studentRangeOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </SelectInput>
                  <FieldError errors={[errors.studentRange]} />
                </Field>
              </div>

              <Field data-invalid={Boolean(errors.document)}>
                <FieldLabel htmlFor="responsible-document">CPF/CNPJ responsável</FieldLabel>
                <Input
                  id="responsible-document"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  aria-invalid={Boolean(errors.document)}
                  {...register("document")}
                  value={document}
                  onChange={(event) => {
                    setValue("document", formatDocument(event.target.value), {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }}
                />
                <FieldError errors={[errors.document]} />
              </Field>

              <div className="grid grid-cols-[7rem_1fr] gap-4">
                <Field data-invalid={Boolean(errors.areaCode)}>
                  <FieldLabel htmlFor="area-code">DDD</FieldLabel>
                  <SearchableOptionsInput
                    id="area-code"
                    value={areaCode}
                    invalid={Boolean(errors.areaCode)}
                    options={areaCodeOptions}
                    placeholder="DDD"
                    inputMode="numeric"
                    noResultsText="Nenhum DDD encontrado"
                    normalizeValue={(value) => value.replace(/\D/g, "").slice(0, 2)}
                    onChange={(value) => {
                      setValue("areaCode", value, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }}
                  />
                  <FieldError errors={[errors.areaCode]} />
                </Field>

                <Field data-invalid={Boolean(errors.contactPhone)}>
                  <FieldLabel htmlFor="contact-phone">Telefone para contato</FieldLabel>
                  <Input
                    id="contact-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder="9 0000-0000"
                    aria-invalid={Boolean(errors.contactPhone)}
                    {...register("contactPhone")}
                    value={contactPhone}
                    onChange={(event) => {
                      setValue("contactPhone", formatPhone(event.target.value), {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }}
                  />
                  <FieldError errors={[errors.contactPhone]} />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field data-invalid={Boolean(errors.country)}>
                  <FieldLabel htmlFor="country">País</FieldLabel>
                  <SelectInput
                    id="country"
                    aria-invalid={Boolean(errors.country)}
                    {...register("country")}
                  >
                    <option value="BR">Brasil</option>
                  </SelectInput>
                  <FieldError errors={[errors.country]} />
                </Field>

                <Field data-invalid={Boolean(errors.state)}>
                  <FieldLabel htmlFor="gym-state-search">Estado</FieldLabel>
                  <SearchableOptionsInput
                    id="gym-state-search"
                    value={state}
                    invalid={Boolean(errors.state)}
                    options={stateOptions}
                    placeholder="Buscar estado"
                    noResultsText="Nenhum estado encontrado"
                    normalizeValue={(value) => value.toUpperCase().slice(0, 2)}
                    onChange={(value) => {
                      setValue("state", value, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }}
                  />
                  <FieldError errors={[errors.state]} />
                </Field>
              </div>
            </FieldGroup>

            <div className="mt-7 grid grid-cols-[auto_1fr] gap-5">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="border-zinc-700 bg-transparent px-10 text-zinc-300 hover:bg-white/5"
                onClick={() => setStep(0)}
              >
                <ArrowLeft /> Voltar
              </Button>
              <Button
                type="button"
                size="lg"
                className="bg-linear-to-b from-yellow-300 to-yellow-500 font-semibold text-black hover:from-yellow-200 hover:to-yellow-400"
                onClick={goToNextStep}
              >
                Continuar <ArrowRight />
              </Button>
            </div>
          </FormCard>
        </StepperContent>

        <StepperContent index={2} className="mt-8">
          <div className="mx-auto w-full text-center">
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#FFECB9] md:text-5xl">
              Você está quase pronto
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-zinc-400">
              Escolha como deseja iniciar sua jornada na Athevo. Você poderá alterar essas configurações depois.
            </p>

            <Field className="mt-7" data-invalid={Boolean(errors["start-work-space-type"])}>
              <Controller
                name="start-work-space-type"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    name={field.name}
                    value={field.value}
                    inputRef={field.ref}
                    aria-label="Como deseja iniciar seu workspace"
                    aria-invalid={Boolean(errors["start-work-space-type"])}
                    className="grid gap-3 text-left md:grid-cols-3"
                    onBlur={field.onBlur}
                    onValueChange={field.onChange}
                  >
                    {completionCards.map(({ icon, value, title, description, disabled }) => (
                      <SelectCard
                        key={value}
                        id={`workspace-type-${value}`}
                        value={value}
                        icon={icon}
                        title={title}
                        description={description}
                        selected={field.value === value}
                        disabled={disabled}
                      />
                    ))}
                  </RadioGroup>
                )}
              />
              <FieldError
                className="mt-3 text-center"
                errors={[errors["start-work-space-type"]]}
              />
            </Field>

            <Button
              type="submit"
              size="lg"
              className="mt-7 min-w-64 bg-linear-to-b from-yellow-300 to-yellow-500 font-semibold text-black shadow-[0_10px_35px_rgba(250,204,21,0.14)] hover:from-yellow-200 hover:to-yellow-400"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Criando workspace..." : "Criar meu workspace"}
              {!registerMutation.isPending ? <Rocket /> : null}
            </Button>

            <button
              type="button"
              className="mx-auto mt-4 flex items-center gap-1 text-xs text-zinc-500 transition hover:text-zinc-300"
              disabled={registerMutation.isPending}
              onClick={() => setStep(1)}
            >
              <ArrowLeft className="size-3" /> Voltar para configurações da academia
            </button>

            {registerMutation.isError ? (
              <p role="alert" className="mt-4 text-sm text-destructive">
                Não foi possível criar o workspace. Tente novamente.
              </p>
            ) : null}
          </div>
        </StepperContent>

        <StepperCompletedContent>
          <div className="mx-auto max-w-xl rounded-xl border border-emerald-400/20 bg-emerald-400/8 p-8 text-center">
            <span className="mx-auto flex size-11 items-center justify-center rounded-full">
              <Logo />
            </span>
            <h2 className="mt-4 text-xl font-semibold text-emerald-300">Workspace criado com sucesso!</h2>

            <Button href="/login" className="mt-6" size="lg">Ir para o login</Button>
          </div>
        </StepperCompletedContent>
      </Stepper>
    </form>
  )
}
