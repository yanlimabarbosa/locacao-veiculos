import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { FiltroDisponibilidade, Veiculo } from "@/types/veiculo";

const PARAMS_POR_FILTRO: Record<FiltroDisponibilidade, { disponivel?: "true" | "false" }> = {
  todos: {},
  disponiveis: { disponivel: "true" },
  indisponiveis: { disponivel: "false" },
};

export function useVeiculos(filtro: FiltroDisponibilidade) {
  return useQuery({
    queryKey: ["veiculos", filtro],
    queryFn: async () => (await apiClient.get<Veiculo[]>("/veiculos", { params: PARAMS_POR_FILTRO[filtro] })).data,
  });
}
