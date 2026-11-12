import type { Request, Response } from "express";
import { idParamSchema } from "../schemas/id-param-schema.js";
import { criarLocacaoSchema, listarLocacoesSchema } from "../schemas/locacao-schemas.js";
import { locacaoService } from "../services/locacao-service.js";
import { usuarioAutenticado } from "../utils/usuario-autenticado.js";

async function criar(req: Request, res: Response) {
  const usuario = usuarioAutenticado(req);
  const dados = criarLocacaoSchema.parse(req.body);
  const locacao = await locacaoService.criar(usuario.id, dados);
  res.status(201).json(locacao);
}

async function listar(req: Request, res: Response) {
  const usuario = usuarioAutenticado(req);
  const filtros = listarLocacoesSchema.parse(req.query);
  const locacoes = await locacaoService.listarDoUsuario(usuario.id, filtros);
  res.status(200).json(locacoes);
}

async function buscarPorId(req: Request, res: Response) {
  const usuario = usuarioAutenticado(req);
  const { id } = idParamSchema.parse(req.params);
  const locacao = await locacaoService.buscarDoUsuario(usuario.id, id);
  res.status(200).json(locacao);
}

async function finalizar(req: Request, res: Response) {
  const usuario = usuarioAutenticado(req);
  const { id } = idParamSchema.parse(req.params);
  const locacao = await locacaoService.finalizar(usuario.id, id);
  res.status(200).json(locacao);
}

export const locacaoController = { criar, listar, buscarPorId, finalizar };
