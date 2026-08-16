import * as yup from "yup"

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
  country: yup.string().required("Selecione o país"),
  state: yup.string().required("Selecione o estado"),
})

export type RegisterFormData = yup.InferType<typeof registerSchema>
