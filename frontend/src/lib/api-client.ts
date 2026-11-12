import axios from "axios";
import { SESSAO_EXPIRADA_EVENT } from "./sessao-expirada-event";
import { tokenStorage } from "./token-storage";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3333/api",
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(undefined, (error) => {
  const sessaoInvalida = axios.isAxiosError(error) && error.response?.status === 401 && tokenStorage.get();
  if (sessaoInvalida) {
    tokenStorage.clear();
    window.dispatchEvent(new Event(SESSAO_EXPIRADA_EVENT));
  }
  return Promise.reject(error);
});
