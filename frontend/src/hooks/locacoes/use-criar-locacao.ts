import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { CriarLocacaoRequest } from "@/types/api/locacoes";
import type { Locacao } from "@/types/locacao";

export function useCriarLocacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dados: CriarLocacaoRequest) => (await apiClient.post<Locacao>("/locacoes", dados)).data,
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["locacoes"] }),
        queryClient.invalidateQueries({ queryKey: ["veiculos"] }),
      ]),
  });
}
