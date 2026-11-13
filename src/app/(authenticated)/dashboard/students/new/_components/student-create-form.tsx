"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useRef, useState } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
  Camera,
  CreditCard,
  Loader2,
  MapPin,
  Save,
  Search,
  Trash2,
  UserRound,
} from "lucide-react"
import { Controller, useForm, useWatch } from "react-hook-form"

import { AuthenticatedCommonTitle } from "@/components/layout/authenticated-common-title"
import { SelectInput } from "@/components/layout/select-input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { formatDocument } from "@/lib/formats"
import { formatCurrency } from "@/lib/currency"
import { canManageStudentTrainers } from "@/lib/tenant-role"
import { appToast } from "@/lib/toast"
import { cn } from "@/lib/utils"
import { getAddressByPostalCode } from "@/services/postal-code-service"
import { listActiveMembershipPlans } from "@/services/membership-plans-service"
import { createStudentInvitation } from "@/services/students-service"
import { listTrainers } from "@/services/trainers-service"

import {
  studentFormDefaultValues,
  studentFormSchema,
  type StudentFormData,
} from "../_data/student-form"
import { StudentFormSection } from "./student-form-section"

const inputClassName =
  "h-10 border-outline-variant bg-surface-container text-on-surface shadow-none placeholder:text-on-surface-variant focus-visible:border-primary-container focus-visible:ring-primary-container/20"
const selectClassName =
  "h-10 border-outline-variant bg-surface-container text-on-surface shadow-none focus:border-primary-container focus:ring-primary-container/20"

function formatStudentPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  if (!digits) return ""
  if (digits.length < 3) return `(${digits}`
  if (digits.length < 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function formatZipCode(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8)
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}

export function StudentCreateForm() {
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const canManageTrainer = canManageStudentTrainers(session?.user.role)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const pendingPostalCodeRef = useRef<string | null>(null)
  const [photo, setPhoto] = useState<{ dataUrl: string; name: string } | null>(null)
  const {
    control,
    clearErrors,
    getValues,
    handleSubmit,
    register,
    setError,
    setFocus,
    setValue,
    formState: { errors },
  } = useForm<StudentFormData>({
    defaultValues: studentFormDefaultValues,
    mode: "onTouched",
    resolver: yupResolver(studentFormSchema),
  })
  const cpf = useWatch({ control, name: "cpf" })
  const phone = useWatch({ control, name: "phone" })
  const zipCode = useWatch({ control, name: "zipCode" })
  const zipCodeRegistration = register("zipCode")
  const membershipPlansQuery = useQuery({
    queryKey: ["membership-plans", "active"],
    queryFn: ({ signal }) => listActiveMembershipPlans(signal),
  })
  const trainersQuery = useQuery({
    queryKey: ["trainers", session?.user.tenantId, "student-form", "active"],
    queryFn: ({ signal }) => listTrainers(
      { active: true, page: 1, pageSize: 100 },
      signal,
    ),
    enabled: sessionStatus === "authenticated"
      && Boolean(session?.user.tenantId)
      && canManageTrainer,
  })

  const postalCodeMutation = useMutation({
    mutationFn: getAddressByPostalCode,
    meta: {
      errorFallback: "Não foi possível consultar o CEP. Tente novamente.",
      errorTitle: "Erro ao buscar CEP",
    },
    onSuccess: (address, requestedPostalCode) => {
      const currentPostalCode = getValues("zipCode").replace(/\D/g, "")
      if (currentPostalCode !== requestedPostalCode.replace(/\D/g, "")) return

      setValue("street", address.street, { shouldDirty: true, shouldValidate: true })
      setValue("district", address.district, { shouldDirty: true, shouldValidate: true })
      setValue("city", address.city, { shouldDirty: true, shouldValidate: true })
      setValue("state", address.state, { shouldDirty: true, shouldValidate: true })
      clearErrors(["street", "district", "city", "state", "zipCode"])
      setFocus("number")
    },
    onSettled: (_data, _error, requestedPostalCode) => {
      if (pendingPostalCodeRef.current === requestedPostalCode) {
        pendingPostalCodeRef.current = null
      }
    },
  })

  const invitationMutation = useMutation({
    mutationFn: createStudentInvitation,
    meta: {
      errorFallback: "Não foi possível enviar o convite. Tente novamente.",
      errorTitle: "Erro ao cadastrar aluno",
    },
    onSuccess: () => {
      appToast.success(
        "Convite enviado",
        "O aluno receberá as instruções para ativar a conta.",
      )
      router.push("/dashboard/students")
      router.refresh()
    },
  })

  function searchPostalCode() {
    const digits = getValues("zipCode").replace(/\D/g, "")

    if (digits.length !== 8) {
      setError("zipCode", {
        message: "Informe um CEP com oito dígitos",
        type: "manual",
      })
      return
    }

    if (pendingPostalCodeRef.current === digits) return

    clearErrors("zipCode")
    pendingPostalCodeRef.current = digits
    postalCodeMutation.mutate(digits)
  }

  function onSubmit(data: StudentFormData) {
    const [firstName, ...lastNameParts] = data.fullName.trim().split(/\s+/)
    const selectedPlan = membershipPlansQuery.data?.find((plan) => plan.id === data.plan)
    const selectedPrice = selectedPlan?.prices[0]

    if (!selectedPrice) {
      setError("plan", {
        message: "Selecione um plano com preço vigente",
        type: "manual",
      })
      return
    }

    invitationMutation.mutate({
      autoRenew: data.autoRenew,
      birthDate: data.birthDate,
      city: data.city.trim(),
      complement: data.complement.trim() || undefined,
      district: data.district.trim(),
      document: data.cpf.replace(/\D/g, ""),
      dueDay: data.dueDay,
      email: data.email.trim(),
      firstName,
      lastName: lastNameParts.join(" "),
      membershipPlanPriceId: selectedPrice.id,
      number: data.number.trim(),
      phone: data.phone.replace(/\D/g, ""),
      startDate: data.startDate,
      state: data.state.toUpperCase(),
      street: data.street.trim(),
      trainerTenantUserId: data.trainer || undefined,
      zipCode: data.zipCode.replace(/\D/g, ""),
    })
  }

  function handlePhotoChange(file?: File) {
    if (!file) return
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      appToast.warning("Formato não suportado", "Selecione uma imagem JPG ou PNG.")
      if (photoInputRef.current) photoInputRef.current.value = ""
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      appToast.warning("Imagem muito grande", "A foto deve ter no máximo 5 MB.")
      if (photoInputRef.current) photoInputRef.current.value = ""
      return
    }

    const reader = new FileReader()
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        setPhoto({ dataUrl: reader.result, name: file.name })
      }
    })
    reader.addEventListener("error", () => {
      appToast.error(new Error("Não foi possível carregar a imagem selecionada."), {
        title: "Erro ao carregar foto",
      })
      if (photoInputRef.current) photoInputRef.current.value = ""
    })
    reader.readAsDataURL(file)
  }

  function removePhoto() {
    setPhoto(null)
    if (photoInputRef.current) photoInputRef.current.value = ""
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <AuthenticatedCommonTitle
          title="Cadastrar Novo Aluno"
          subTitle="Preencha as informações abaixo para adicionar um novo membro ao sistema."
        />
        <div className="flex w-full items-center gap-3 sm:w-auto">
          <Button
            href="/dashboard/students"
            variant="outline"
            className="h-10 flex-1 border-outline-variant bg-transparent px-4 text-on-surface hover:bg-surface-container-high sm:flex-none"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={invitationMutation.isPending}
            className="h-10 flex-1 bg-primary-container px-4 font-semibold text-black shadow-[0_4px_14px_rgba(250,204,21,0.18)] hover:bg-primary-container/90 sm:flex-none"
          >
            {invitationMutation.isPending ? (
              <Loader2 aria-hidden="true" className="animate-spin" />
            ) : (
              <Save aria-hidden="true" />
            )}
            {invitationMutation.isPending ? "Enviando..." : "Salvar Aluno"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <StudentFormSection icon={UserRound} title="Informações Pessoais">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field className="md:col-span-2" data-invalid={Boolean(errors.fullName)}>
                <FieldLabel htmlFor="student-name">Nome Completo</FieldLabel>
                <Input
                  id="student-name"
                  autoComplete="name"
                  placeholder="Ex: João da Silva"
                  className={inputClassName}
                  aria-invalid={Boolean(errors.fullName)}
                  {...register("fullName")}
                />
                <FieldError errors={[errors.fullName]} />
              </Field>

              <Field data-invalid={Boolean(errors.email)}>
                <FieldLabel htmlFor="student-email">E-mail</FieldLabel>
                <Input
                  id="student-email"
                  type="email"
                  autoComplete="email"
                  placeholder="joao@exemplo.com"
                  className={inputClassName}
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
                <FieldError errors={[errors.email]} />
              </Field>

              <Field data-invalid={Boolean(errors.phone)}>
                <FieldLabel htmlFor="student-phone">Telefone</FieldLabel>
                <Input
                  id="student-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="(00) 00000-0000"
                  className={inputClassName}
                  aria-invalid={Boolean(errors.phone)}
                  {...register("phone")}
                  value={phone}
                  onChange={(event) =>
                    setValue("phone", formatStudentPhone(event.target.value), {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                />
                <FieldError errors={[errors.phone]} />
              </Field>

              <Field data-invalid={Boolean(errors.cpf)}>
                <FieldLabel htmlFor="student-cpf">CPF</FieldLabel>
                <Input
                  id="student-cpf"
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  className={inputClassName}
                  aria-invalid={Boolean(errors.cpf)}
                  {...register("cpf")}
                  value={cpf}
                  onChange={(event) =>
                    setValue("cpf", formatDocument(event.target.value), {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                />
                <FieldError errors={[errors.cpf]} />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field data-invalid={Boolean(errors.birthDate)}>
                  <FieldLabel htmlFor="student-birth-date">Data de Nasc.</FieldLabel>
                  <Input
                    id="student-birth-date"
                    type="date"
                    className={cn(inputClassName, "[color-scheme:dark]")}
                    aria-invalid={Boolean(errors.birthDate)}
                    {...register("birthDate")}
                  />
                  <FieldError errors={[errors.birthDate]} />
                </Field>
                <Field data-invalid={Boolean(errors.gender)}>
                  <FieldLabel htmlFor="student-gender">Gênero</FieldLabel>
                  <SelectInput
                    id="student-gender"
                    className={selectClassName}
                    aria-invalid={Boolean(errors.gender)}
                    {...register("gender")}
                  >
                    <option value="">Selecione</option>
                    <option value="male">Masculino</option>
                    <option value="female">Feminino</option>
                    <option value="other">Outro</option>
                  </SelectInput>
                  <FieldError errors={[errors.gender]} />
                </Field>
              </div>
            </div>
          </StudentFormSection>

          <StudentFormSection icon={MapPin} title="Endereço">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
              <Field className="md:col-span-2" data-invalid={Boolean(errors.zipCode)}>
                <FieldLabel htmlFor="student-zip-code">CEP</FieldLabel>
                <div className="relative">
                  <Input
                    id="student-zip-code"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="00000-000"
                    className={cn(inputClassName, "pr-10")}
                    aria-invalid={Boolean(errors.zipCode)}
                    {...zipCodeRegistration}
                    value={zipCode}
                    onChange={(event) =>
                      setValue("zipCode", formatZipCode(event.target.value), {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    onBlur={(event) => {
                      zipCodeRegistration.onBlur(event)
                      if (event.currentTarget.value.replace(/\D/g, "").length === 8) {
                        searchPostalCode()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Buscar endereço pelo CEP"
                    title="Buscar CEP"
                    disabled={postalCodeMutation.isPending}
                    onClick={searchPostalCode}
                    className="absolute top-1/2 right-2 -translate-y-1/2 text-on-surface-variant hover:bg-primary-container/10 hover:text-primary-container"
                  >
                    {postalCodeMutation.isPending ? (
                      <Loader2 aria-hidden="true" className="animate-spin" />
                    ) : (
                      <Search aria-hidden="true" />
                    )}
                  </Button>
                </div>
                <FieldError errors={[errors.zipCode]} />
              </Field>
              <Field className="md:col-span-4" data-invalid={Boolean(errors.street)}>
                <FieldLabel htmlFor="student-street">Rua</FieldLabel>
                <Input
                  id="student-street"
                  autoComplete="address-line1"
                  placeholder="Nome da rua, avenida..."
                  className={inputClassName}
                  aria-invalid={Boolean(errors.street)}
                  {...register("street")}
                />
                <FieldError errors={[errors.street]} />
              </Field>
              <Field className="md:col-span-2" data-invalid={Boolean(errors.number)}>
                <FieldLabel htmlFor="student-address-number">Número</FieldLabel>
                <Input
                  id="student-address-number"
                  placeholder="123"
                  className={inputClassName}
                  aria-invalid={Boolean(errors.number)}
                  {...register("number")}
                />
                <FieldError errors={[errors.number]} />
              </Field>
              <Field className="md:col-span-4">
                <FieldLabel htmlFor="student-complement">Complemento</FieldLabel>
                <Input
                  id="student-complement"
                  autoComplete="address-line2"
                  placeholder="Apto, bloco..."
                  className={inputClassName}
                  {...register("complement")}
                />
              </Field>
              <Field className="md:col-span-2" data-invalid={Boolean(errors.district)}>
                <FieldLabel htmlFor="student-district">Bairro</FieldLabel>
                <Input
                  id="student-district"
                  placeholder="Bairro"
                  className={inputClassName}
                  aria-invalid={Boolean(errors.district)}
                  {...register("district")}
                />
                <FieldError errors={[errors.district]} />
              </Field>
              <Field className="md:col-span-3" data-invalid={Boolean(errors.city)}>
                <FieldLabel htmlFor="student-city">Cidade</FieldLabel>
                <Input
                  id="student-city"
                  autoComplete="address-level2"
                  placeholder="Cidade"
                  className={inputClassName}
                  aria-invalid={Boolean(errors.city)}
                  {...register("city")}
                />
                <FieldError errors={[errors.city]} />
              </Field>
              <Field className="md:col-span-1" data-invalid={Boolean(errors.state)}>
                <FieldLabel htmlFor="student-state">UF</FieldLabel>
                <Input
                  id="student-state"
                  autoComplete="address-level1"
                  maxLength={2}
                  placeholder="SP"
                  className={cn(inputClassName, "uppercase")}
                  aria-invalid={Boolean(errors.state)}
                  {...register("state")}
                  onChange={(event) =>
                    setValue("state", event.target.value.toUpperCase().slice(0, 2), {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                />
                <FieldError errors={[errors.state]} />
              </Field>
            </div>
          </StudentFormSection>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <label className="group relative flex h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-outline-variant bg-surface-glass p-6 text-center transition-colors hover:border-primary-container focus-within:border-primary-container">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="sr-only"
                onChange={(event) => handlePhotoChange(event.target.files?.[0])}
              />
              {photo ? (
                <>
                  <Image
                    src={photo.dataUrl}
                    alt={`Pré-visualização de ${photo.name}`}
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-black/90 to-transparent px-5 pt-12 pb-4 text-left">
                    <span className="block truncate text-sm font-medium text-white">
                      {photo.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-zinc-300">
                      Clique na imagem para alterar
                    </span>
                  </span>
                </>
              ) : (
                <>
                  <span className="mb-4 flex size-24 items-center justify-center rounded-full border border-outline-variant bg-surface-container transition-colors group-hover:border-primary-container/50">
                    <Camera
                      aria-hidden="true"
                      className="size-9 text-on-surface-variant transition-colors group-hover:text-primary-container"
                    />
                  </span>
                  <span className="font-medium text-on-surface transition-colors group-hover:text-primary-container">
                    Adicionar Foto
                  </span>
                  <span className="mt-1 text-xs text-on-surface-variant">
                    JPG, PNG (Máx. 5 MB)
                  </span>
                </>
              )}
            </label>

            {photo && (
              <Button
                type="button"
                variant="destructive"
                size="icon-sm"
                aria-label="Remover foto selecionada"
                title="Remover foto"
                onClick={removePhoto}
                className="absolute top-3 right-3 z-20 border border-red-400/30 bg-black/70 text-red-300 shadow-lg backdrop-blur-sm hover:bg-red-500/25 hover:text-red-200"
              >
                <Trash2 aria-hidden="true" />
              </Button>
            )}
          </div>

          <StudentFormSection icon={CreditCard} title="Plano e Matrícula">
            <div className="space-y-4">
              <Field data-invalid={Boolean(errors.plan)}>
                <FieldLabel>Seleção de Plano</FieldLabel>
                <Controller
                  name="plan"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      name={field.name}
                      value={field.value}
                      inputRef={field.ref}
                      aria-label="Seleção de plano"
                      className="grid grid-cols-3 gap-2"
                      onBlur={field.onBlur}
                      onValueChange={field.onChange}
                    >
                      {membershipPlansQuery.data?.map((plan) => {
                        const price = plan.prices[0]
                        const monthlyEquivalent = price?.billingInterval === "yearly"
                          ? price.amount / (12 * price.intervalCount)
                          : null

                        return (
                          <label
                            key={plan.id}
                            htmlFor={`student-plan-${plan.id}`}
                            className="relative cursor-pointer overflow-hidden rounded-lg"
                          >
                            <RadioGroupItem
                              id={`student-plan-${plan.id}`}
                              value={plan.id}
                              variant="card"
                            />

                            <span className="relative flex min-h-16 flex-col items-center justify-center overflow-hidden rounded-lg border border-outline-variant px-2 py-1 text-xs font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high peer-focus-visible:border-primary-container peer-focus-visible:ring-2 peer-focus-visible:ring-primary-container/30 peer-data-checked:border-primary-container peer-data-checked:bg-primary-container/10 peer-data-checked:text-primary-container sm:text-sm">
                              <span>{plan.name}</span>
                              {price && (
                                <span className="text-[10px] font-normal text-on-surface-variant">
                                  {formatCurrency(price.amount, price.currency)}
                                  /{price.billingInterval === "yearly" ? "ano" : "mês"}
                                </span>
                              )}
                              {monthlyEquivalent !== null && (
                                <span className="text-[10px] font-normal text-on-surface-variant">
                                  equivale a {formatCurrency(monthlyEquivalent, price.currency)}/mês
                                </span>
                              )}
                            </span>
                          </label>
                        )
                      })}
                    </RadioGroup>
                  )}
                />
                {membershipPlansQuery.isPending && (
                  <p className="text-xs text-on-surface-variant">Carregando planos...</p>
                )}
                {membershipPlansQuery.isError && (
                  <p role="alert" className="text-xs text-error">
                    {membershipPlansQuery.error.message}
                  </p>
                )}
                {membershipPlansQuery.isSuccess
                  && membershipPlansQuery.data.length === 0 && (
                    <p role="status" className="text-xs text-on-surface-variant">
                      Nenhum plano ativo está disponível.
                    </p>
                  )}
                <FieldError errors={[errors.plan]} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field data-invalid={Boolean(errors.startDate)}>
                  <FieldLabel htmlFor="student-start-date">Data de Início</FieldLabel>
                  <Input
                    id="student-start-date"
                    type="date"
                    className={cn(inputClassName, "[color-scheme:dark]")}
                    aria-invalid={Boolean(errors.startDate)}
                    {...register("startDate")}
                  />
                  <FieldError errors={[errors.startDate]} />
                </Field>
                <Field data-invalid={Boolean(errors.dueDay)}>
                  <FieldLabel htmlFor="student-due-day">Vencimento</FieldLabel>
                  <Input
                    id="student-due-day"
                    type="number"
                    min={1}
                    max={28}
                    placeholder="Dia"
                    className={inputClassName}
                    aria-invalid={Boolean(errors.dueDay)}
                    {...register("dueDay", { valueAsNumber: true })}
                  />
                  <FieldError errors={[errors.dueDay]} />
                </Field>
              </div>

              <Controller
                name="autoRenew"
                control={control}
                render={({ field }) => (
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-on-surface-variant">
                    <Checkbox
                      checked={field.value}
                      className="mt-0.5"
                      onBlur={field.onBlur}
                      onCheckedChange={field.onChange}
                    />
                    <span>Renovar a matrícula automaticamente ao fim do período.</span>
                  </label>
                )}
              />

              {canManageTrainer && (
                <Field data-invalid={Boolean(errors.trainer)}>
                <FieldLabel htmlFor="student-trainer">Professor Vinculado</FieldLabel>
                <SelectInput
                  id="student-trainer"
                  className={selectClassName}
                  aria-invalid={Boolean(errors.trainer)}
                  {...register("trainer")}
                >
                  <option value="">Nenhum professor</option>
                  {trainersQuery.data?.items.map((trainer) => (
                    <option key={trainer.tenantUserId} value={trainer.tenantUserId}>
                      {trainer.name}
                    </option>
                  ))}
                </SelectInput>
                {trainersQuery.isPending && (
                  <p className="text-xs text-on-surface-variant">
                    Carregando professores...
                  </p>
                )}
                {trainersQuery.isError && (
                  <p role="alert" className="text-xs text-error">
                    {trainersQuery.error.message}
                  </p>
                )}
                {trainersQuery.isSuccess && trainersQuery.data.items.length === 0 && (
                  <p role="status" className="text-xs text-on-surface-variant">
                    Nenhum professor ativo esta disponivel.
                  </p>
                )}
                  <FieldError errors={[errors.trainer]} />
                </Field>
              )}
            </div>
          </StudentFormSection>
        </div>
      </div>
    </form>
  )
}
