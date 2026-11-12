import { z } from "zod";

export const criarLocacaoSchema = z.object({
  veiculoId: z.number("Informe o veículo.").int().positive("Veículo inválido."),
  dataInicio: z.coerce.date("Data de início inválida."),
  dataPrevistaDevolucao: z.coerce.date("Data prevista de devolução inválida."),
});

export const listarLocacoesSchema = z.object({
  status: z.enum(["ATIVA", "FINALIZADA"]).optional(),
});

export type CriarLocacaoInput = z.infer<typeof criarLocacaoSchema>;
export type ListarLocacoesInput = z.infer<typeof listarLocacoesSchema>;
