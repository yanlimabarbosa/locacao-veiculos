import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { CadastroRequest } from "@/types/api/auth";
import type { Usuario } from "@/types/usuario";

export function useCadastro() {
  return useMutation({
    mutationFn: async (dados: CadastroRequest) => (await apiClient.post<Usuario>("/auth/cadastro", dados)).data,
  });
}
