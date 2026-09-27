import * as yup from "yup"

import { validarCPF } from "@/lib/utils"

export interface StudentFormData {
  birthDate: string
  city: string
  complement: string
  cpf: string
  district: string
  dueDay: number
  email: string
  fullName: string
  gender: string
  number: string
  phone: string
  plan: string
  startDate: string
  state: string
  street: string
  trainer: string
  zipCode: string
}

export const studentFormSchema: yup.ObjectSchema<StudentFormData> = yup.object({
  fullName: yup
    .string()
    .trim()
    .min(3, "Informe o nome completo")
    .required("O nome é obrigatório"),
  email: yup
    .string()
    .trim()
    .email("Informe um e-mail válido")
    .required("O e-mail é obrigatório"),
  phone: yup
    .string()
    .required("O telefone é obrigatório")
    .test("valid-phone", "Informe um telefone válido", (value) =>
      /^\d{10,11}$/.test(value?.replace(/\D/g, "") ?? ""),
    ),
  cpf: yup
    .string()
    .required("O CPF é obrigatório")
    .test("valid-cpf", "Informe um CPF válido", (value) =>
      Boolean(value && validarCPF(value)),
    ),
  birthDate: yup.string().required("A data de nascimento é obrigatória"),
  gender: yup.string().required("Selecione o gênero"),
  zipCode: yup
    .string()
    .required("O CEP é obrigatório")
    .test("valid-zip-code", "Informe um CEP válido", (value) =>
      /^\d{8}$/.test(value?.replace(/\D/g, "") ?? ""),
    ),
  street: yup.string().trim().required("A rua é obrigatória"),
  number: yup.string().trim().required("O número é obrigatório"),
  complement: yup.string().trim().defined(),
  district: yup.string().trim().required("O bairro é obrigatório"),
  city: yup.string().trim().required("A cidade é obrigatória"),
  state: yup
    .string()
    .trim()
    .matches(/^[A-Za-z]{2}$/, "Informe uma UF válida")
    .required("A UF é obrigatória"),
  plan: yup.string().oneOf(["monthly", "quarterly", "annual"]).required(),
  startDate: yup.string().required("A data de início é obrigatória"),
  dueDay: yup
    .number()
    .typeError("Informe o dia do vencimento")
    .integer("Informe um dia inteiro")
    .min(1, "O dia mínimo é 1")
    .max(31, "O dia máximo é 31")
    .required("O vencimento é obrigatório"),
  trainer: yup.string().required("Selecione um professor"),
})

export const studentFormDefaultValues: StudentFormData = {
  birthDate: "",
  city: "",
  complement: "",
  cpf: "",
  district: "",
  dueDay: 10,
  email: "",
  fullName: "",
  gender: "",
  number: "",
  phone: "",
  plan: "monthly",
  startDate: "",
  state: "",
  street: "",
  trainer: "",
  zipCode: "",
}

export const planOptions = [
  { label: "Mensal", value: "monthly" },
  { label: "Trimestral", value: "quarterly" },
  { badge: "15% OFF", label: "Anual", value: "annual" },
] as const

export const trainerOptions = [
  { label: "Marcos Silva", value: "1" },
  { label: "Ana Souza", value: "2" },
  { label: "Carlos Mendes", value: "3" },
] as const
