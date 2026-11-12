import type { Request, Response } from "express";
import { cadastroSchema, loginSchema } from "../schemas/auth-schemas.js";
import { authService } from "../services/auth-service.js";
import { usuarioAutenticado } from "../utils/usuario-autenticado.js";

async function cadastrar(req: Request, res: Response) {
  const dados = cadastroSchema.parse(req.body);
  const usuario = await authService.cadastrar(dados);
  res.status(201).json(usuario);
}

async function login(req: Request, res: Response) {
  const dados = loginSchema.parse(req.body);
  const sessao = await authService.login(dados);
  res.status(200).json(sessao);
}

async function perfil(req: Request, res: Response) {
  const { id } = usuarioAutenticado(req);
  const usuario = await authService.buscarPorId(id);
  res.status(200).json(usuario);
}

export const authController = { cadastrar, login, perfil };
