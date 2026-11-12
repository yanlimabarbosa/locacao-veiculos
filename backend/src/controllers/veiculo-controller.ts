import type { Request, Response } from "express";
import { idParamSchema } from "../schemas/id-param-schema.js";
import { criarVeiculoSchema, listarVeiculosSchema } from "../schemas/veiculo-schemas.js";
import { veiculoService } from "../services/veiculo-service.js";

async function criar(req: Request, res: Response) {
  const dados = criarVeiculoSchema.parse(req.body);
  const veiculo = await veiculoService.criar(dados);
  res.status(201).json(veiculo);
}

async function listar(req: Request, res: Response) {
  const filtros = listarVeiculosSchema.parse(req.query);
  const veiculos = await veiculoService.listar(filtros);
  res.status(200).json(veiculos);
}

async function buscarPorId(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  const veiculo = await veiculoService.buscarPorId(id);
  res.status(200).json(veiculo);
}

export const veiculoController = { criar, listar, buscarPorId };
