import * as yup from "yup"

import { validarCNPJ, validarCPF } from "@/lib/utils"

export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Informe um e-mail válido")
    .required("O e-mail é obrigatório"),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .required("A senha é obrigatória"),
})

export type LoginFormData = yup.InferType<typeof loginSchema>

export const registerSchema = yup.object({
  firstName: yup
    .string()
    .trim()
    .min(2, "Informe seu nome")
    .required("O nome é obrigatório"),
  lastName: yup
    .string()
    .trim()
    .min(2, "Informe seu sobrenome")
    .required("O sobrenome é obrigatório"),
  email: yup
    .string()
    .trim()
    .email("Informe um e-mail válido")
    .required("O e-mail é obrigatório"),
  password: yup
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .required("A senha é obrigatória"),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas devem ser iguais")
    .required("Confirme sua senha"),
  acceptedTerms: yup
    .boolean()
    .oneOf([true], "Você precisa aceitar os termos para continuar")
    .required("Você precisa aceitar os termos para continuar"),
  gymName: yup
    .string()
    .trim()
    .min(2, "Informe o nome da academia")
    .required("O nome da academia é obrigatório"),
  gymType: yup
    .string()
    .required("Selecione o tipo da academia"),
  studentRange: yup
    .string()
    .required("Selecione a quantidade de alunos"),
  document: yup
    .string()
    .trim()
    .required("Informe o CPF ou CNPJ do responsável")
    .test(
      "valid-document",
      "Informe um CPF ou CNPJ válido",
      (value) => Boolean(value) && (validarCPF(value) || validarCNPJ(value))
    ),
  contactPhone: yup
    .string()
    .trim()
    .required("Informe um telefone para contato")
    .test(
      "valid-phone",
      "Informe um telefone válido",
      (value) => Boolean(value) && /^\d{8,9}$/.test(value.replace(/\D/g, ""))
    ),
  areaCode: yup
    .string()
    .matches(/^\d{2}$/, "Selecione o DDD")
    .required("Selecione o DDD"),
  country: yup.string().required("Selecione o país"),
  state: yup.string().required("Selecione o estado"),
  "start-work-space-type": yup
    .string()
    .test(
      "valid-start-workspace-type",
      "Selecione como deseja iniciar seu workspace",
      (value) => ["start-from-scratch", "use-template"].includes(value ?? "")
    )
    .required("Selecione como deseja iniciar seu workspace"),
})

export type RegisterFormData = yup.InferType<typeof registerSchema>
