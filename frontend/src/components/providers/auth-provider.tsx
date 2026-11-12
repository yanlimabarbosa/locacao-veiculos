import { useQueryClient } from "@tanstack/react-query";
import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { usePerfil } from "@/hooks/auth/use-perfil";
import { SESSAO_EXPIRADA_EVENT } from "@/lib/sessao-expirada-event";
import { tokenStorage } from "@/lib/token-storage";
import type { LoginResponse } from "@/types/api/auth";
import { AuthContext, type AuthContextValue } from "./auth-context";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(tokenStorage.get);
  const perfil = usePerfil(Boolean(token));

  const entrar = useCallback(
    (sessao: LoginResponse) => {
      tokenStorage.set(sessao.token);
      queryClient.setQueryData(["perfil"], sessao.usuario);
      setToken(sessao.token);
    },
    [queryClient],
  );

  const sair = useCallback(() => {
    tokenStorage.clear();
    setToken(null);
    queryClient.clear();
  }, [queryClient]);

  useEffect(() => {
    function aoExpirarSessao() {
      sair();
      toast.error("Sua sessão expirou. Entre novamente.");
    }
    window.addEventListener(SESSAO_EXPIRADA_EVENT, aoExpirarSessao);
    return () => window.removeEventListener(SESSAO_EXPIRADA_EVENT, aoExpirarSessao);
  }, [sair]);

  const value = useMemo<AuthContextValue>(
    () => ({
      usuario: perfil.data ?? null,
      autenticado: Boolean(token),
      carregando: Boolean(token) && perfil.isLoading,
      entrar,
      sair,
    }),
    [perfil.data, perfil.isLoading, token, entrar, sair],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
