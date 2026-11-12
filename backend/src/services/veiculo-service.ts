import { AppError } from "../errors/app-error.js";
import { prisma } from "../lib/prisma.js";
import type { CriarVeiculoInput, ListarVeiculosInput } from "../schemas/veiculo-schemas.js";

async function criar(dados: CriarVeiculoInput) {
  const placaEmUso = await prisma.veiculo.findUnique({ where: { placa: dados.placa } });
  if (placaEmUso) {
    throw new AppError("Já existe um veículo cadastrado com esta placa.", 409);
  }

  return prisma.veiculo.create({ data: dados });
}

async function listar({ disponivel }: ListarVeiculosInput) {
  return prisma.veiculo.findMany({
    where: disponivel === undefined ? undefined : { disponivel: disponivel === "true" },
    orderBy: [{ marca: "asc" }, { modelo: "asc" }],
  });
}

async function buscarPorId(id: number) {
  const veiculo = await prisma.veiculo.findUnique({ where: { id } });
  if (!veiculo) {
    throw new AppError("Veículo não encontrado.", 404);
  }
  return veiculo;
}

export const veiculoService = { criar, listar, buscarPorId };
