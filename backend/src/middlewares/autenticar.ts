import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";
import { prisma } from "../lib/prisma.js";

export async function autenticar(req: Request, _res: Response, next: NextFunction) {
  const [esquema, token] = req.headers.authorization?.split(" ") ?? [];
  if (esquema !== "Bearer" || !token) {
    throw new AppError("Token de autenticação não informado.", 401);
  }

  const usuarioId = extrairUsuarioId(token);
  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    select: { id: true, nome: true, email: true },
  });
  if (!usuario) {
    throw new AppError("Usuário do token não existe mais.", 401);
  }

  req.usuario = usuario;
  next();
}

function extrairUsuarioId(token: string) {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    const usuarioId = Number(typeof payload === "string" ? NaN : payload.sub);
    if (!Number.isInteger(usuarioId)) {
      throw new Error();
    }
    return usuarioId;
  } catch {
    throw new AppError("Token inválido ou expirado.", 401);
  }
}
