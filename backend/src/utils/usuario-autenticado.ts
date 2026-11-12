import type { Request } from "express";
import { AppError } from "../errors/app-error.js";

export function usuarioAutenticado(req: Request) {
  if (!req.usuario) {
    throw new AppError("Usuário não autenticado.", 401);
  }
  return req.usuario;
}
