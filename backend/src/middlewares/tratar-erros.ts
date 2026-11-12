import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app-error.js";
import { Prisma } from "../generated/prisma/client.js";

export function tratarErros(erro: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (erro instanceof AppError) {
    res.status(erro.statusCode).json({ mensagem: erro.message });
    return;
  }

  if (erro instanceof ZodError) {
    res.status(400).json({
      mensagem: erro.issues[0]?.message ?? "Dados inválidos.",
      erros: erro.issues.map((issue) => ({ campo: issue.path.join("."), mensagem: issue.message })),
    });
    return;
  }

  if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === "P2002") {
    res.status(409).json({ mensagem: "Registro duplicado: o valor informado já está em uso." });
    return;
  }

  if (erro instanceof SyntaxError && "body" in erro) {
    res.status(400).json({ mensagem: "JSON inválido no corpo da requisição." });
    return;
  }

  console.error(erro);
  res.status(500).json({ mensagem: "Erro interno do servidor." });
}
