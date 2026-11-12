import { createContext } from "react";
import type { LoginResponse } from "@/types/api/auth";
import type { Usuario } from "@/types/usuario";

export type AuthContextValue = {
  usuario: Usuario | null;
  autenticado: boolean;
  carregando: boolean;
  entrar: (sessao: LoginResponse) => void;
  sair: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
