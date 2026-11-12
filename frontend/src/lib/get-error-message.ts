import axios from "axios";
import type { ApiError } from "@/types/api/api-error";

export function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiError>(error)) {
    if (error.response?.data?.mensagem) return error.response.data.mensagem;
    if (!error.response) return "Não foi possível conectar à API. Verifique se o backend está rodando.";
  }
  return "Algo deu errado. Tente novamente.";
}
