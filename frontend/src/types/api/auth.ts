import type { Usuario } from "../usuario";

export type LoginResponse = {
  token: string;
  usuario: Usuario;
};

export type LoginRequest = {
  email: string;
  senha: string;
};

export type CadastroRequest = {
  nome: string;
  email: string;
  senha: string;
};
