import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Usuario } from "@/types/usuario";

export function usePerfil(enabled: boolean) {
  return useQuery({
    queryKey: ["perfil"],
    queryFn: async () => (await apiClient.get<Usuario>("/auth/me")).data,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
