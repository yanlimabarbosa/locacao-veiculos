import { z } from "zod";

export const cadastroSchema = z.object({
  nome: z.string().trim().min(2, "O nome deve ter ao menos 2 caracteres.").max(120),
  email: z.email("E-mail inválido.").trim().toLowerCase().max(160),
  senha: z.string().min(6, "A senha deve ter ao menos 6 caracteres.").max(72),
});

export const loginSchema = z.object({
  email: z.email("E-mail inválido.").trim().toLowerCase(),
  senha: z.string().min(1, "Informe a senha."),
});

export type CadastroInput = z.infer<typeof cadastroSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
