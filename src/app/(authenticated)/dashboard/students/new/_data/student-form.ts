import * as yup from "yup"

import { validarCPF } from "@/lib/utils"

export interface StudentFormData {
  autoRenew: boolean
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
  autoRenew: yup.boolean().defined(),
  fullName: yup
    .string()
    .trim()
    .min(3, "Informe o nome completo")
    .test(
      "full-name",
      "Informe nome e sobrenome",
      (value) => (value?.trim().split(/\s+/).length ?? 0) >= 2,
    )
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
  plan: yup
    .string()
    .uuid("Selecione um plano válido")
    .required("Selecione um plano"),
  startDate: yup.string().required("A data de início é obrigatória"),
  dueDay: yup
    .number()
    .typeError("Informe o dia do vencimento")
    .integer("Informe um dia inteiro")
    .min(1, "O dia mínimo é 1")
    .max(28, "O dia máximo é 28")
    .required("O vencimento é obrigatório"),
  trainer: yup
    .string()
    .test(
      "valid-trainer",
      "Selecione um professor valido",
      (value) => !value || yup.string().uuid().isValidSync(value),
    )
    .defined(),
})

export const studentFormDefaultValues: StudentFormData = {
  autoRenew: true,
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
  plan: "",
  startDate: "",
  state: "",
  street: "",
  trainer: "",
  zipCode: "",
}
