import { z } from "zod";

const PLACA_REGEX = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
const ANO_MAXIMO = new Date().getFullYear() + 1;

export const criarVeiculoSchema = z.object({
  marca: z.string().trim().min(1, "Informe a marca.").max(60),
  modelo: z.string().trim().min(1, "Informe o modelo.").max(60),
  placa: z
    .string()
    .trim()
    .toUpperCase()
    .transform((placa) => placa.replace(/[^A-Z0-9]/g, ""))
    .pipe(z.string().regex(PLACA_REGEX, "Placa inválida. Use o formato ABC1234 ou ABC1D23.")),
  ano: z
    .number("O ano deve ser um número.")
    .int("O ano deve ser um número inteiro.")
    .min(1950, "O ano deve ser a partir de 1950.")
    .max(ANO_MAXIMO, `O ano deve ser no máximo ${ANO_MAXIMO}.`),
  valorDiaria: z
    .number("O valor da diária deve ser um número.")
    .positive("O valor da diária deve ser positivo.")
    .max(99999999.99),
});

export const listarVeiculosSchema = z.object({
  disponivel: z.enum(["true", "false"]).optional(),
});

export type CriarVeiculoInput = z.infer<typeof criarVeiculoSchema>;
export type ListarVeiculosInput = z.infer<typeof listarVeiculosSchema>;
