export type Veiculo = {
  id: number;
  marca: string;
  modelo: string;
  placa: string;
  ano: number;
  valorDiaria: string;
  disponivel: boolean;
  criadoEm: string;
};

export type VeiculoResumo = Pick<Veiculo, "id" | "marca" | "modelo" | "placa" | "ano" | "valorDiaria">;

export type FiltroDisponibilidade = "todos" | "disponiveis" | "indisponiveis";
