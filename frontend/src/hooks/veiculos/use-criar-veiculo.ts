import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { CriarVeiculoRequest } from "@/types/api/veiculos";
import type { Veiculo } from "@/types/veiculo";

export function useCriarVeiculo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dados: CriarVeiculoRequest) => (await apiClient.post<Veiculo>("/veiculos", dados)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["veiculos"] }),
  });
}
