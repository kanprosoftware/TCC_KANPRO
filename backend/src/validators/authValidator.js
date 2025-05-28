import * as yup from "yup";

export const registerSchema = yup.object({
  body: yup.object({
    email: yup.string().email().required("O email é obrigatório!"),
    name: yup
      .string()
      .min(6, "nome deve ser completo")
      .required("O nome é obrigatório!"),
    password: yup
      .string()
      .min(6, "A senha deve ter pelo menos 6 caracteres")
      .required("A senha é obrigatória!"),
    habilidades: yup
      .array()
      .of(yup.string().required("Cada habilidade deve ser uma string"))
      .required("As habilidades são obrigatórias!")
      .min(1, "Você deve fornecer pelo menos uma habilidade"),
  }),
});


export const loginSchema = yup.object({
    body: yup.object({
        email: yup.string().email().required("O email é obrigatório!"),
        password: yup.string().min(6).required(),
    }),
  });