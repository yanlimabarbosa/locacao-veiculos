import type { VeiculoResumo } from "./veiculo";

export type StatusLocacao = "ATIVA" | "FINALIZADA";

export type Locacao = {
  id: number;
  usuarioId: number;
  veiculoId: number;
  dataInicio: string;
  dataPrevistaDevolucao: string;
  dataDevolucao: string | null;
  quantidadeDiarias: number;
  valorTotal: string;
  status: StatusLocacao;
  criadoEm: string;
  veiculo: VeiculoResumo;
};

export type FiltroStatusLocacao = "todas" | StatusLocacao;
