import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Locacao } from "@/types/locacao";

export function useFinalizarLocacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await apiClient.patch<Locacao>(`/locacoes/${id}/finalizar`)).data,
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["locacoes"] }),
        queryClient.invalidateQueries({ queryKey: ["veiculos"] }),
      ]),
  });
}
