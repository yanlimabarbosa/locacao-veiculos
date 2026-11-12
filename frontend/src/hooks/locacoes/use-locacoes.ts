import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { FiltroStatusLocacao, Locacao } from "@/types/locacao";

export function useLocacoes(filtro: FiltroStatusLocacao) {
  const params = filtro === "todas" ? {} : { status: filtro };
  return useQuery({
    queryKey: ["locacoes", filtro],
    queryFn: async () => (await apiClient.get<Locacao[]>("/locacoes", { params })).data,
  });
}
