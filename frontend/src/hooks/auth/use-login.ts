import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { LoginRequest, LoginResponse } from "@/types/api/auth";
import { useAuth } from "./use-auth";

export function useLogin() {
  const { entrar } = useAuth();
  return useMutation({
    mutationFn: async (dados: LoginRequest) => (await apiClient.post<LoginResponse>("/auth/login", dados)).data,
    onSuccess: entrar,
  });
}
