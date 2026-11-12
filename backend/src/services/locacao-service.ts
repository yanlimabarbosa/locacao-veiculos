import { AppError } from "../errors/app-error.js";
import { prisma } from "../lib/prisma.js";
import type { CriarLocacaoInput, ListarLocacoesInput } from "../schemas/locacao-schemas.js";
import { calcularDiarias } from "../utils/calcular-diarias.js";

const TOLERANCIA_INICIO_MS = 5 * 60 * 1000;

const veiculoResumoSelect = {
  id: true,
  marca: true,
  modelo: true,
  placa: true,
  ano: true,
  valorDiaria: true,
} as const;

const locacaoInclude = {
  veiculo: { select: veiculoResumoSelect },
} as const;

function validarPeriodo(dataInicio: Date, dataPrevistaDevolucao: Date) {
  if (dataInicio.getTime() < Date.now() - TOLERANCIA_INICIO_MS) {
    throw new AppError("A data de início não pode estar no passado.", 400);
  }
  if (dataPrevistaDevolucao <= dataInicio) {
    throw new AppError("A data prevista de devolução deve ser posterior à data de início.", 400);
  }
}

async function criar(usuarioId: number, { veiculoId, dataInicio, dataPrevistaDevolucao }: CriarLocacaoInput) {
  validarPeriodo(dataInicio, dataPrevistaDevolucao);

  return prisma.$transaction(async (tx) => {
    const veiculo = await tx.veiculo.findUnique({ where: { id: veiculoId } });
    if (!veiculo) {
      throw new AppError("Veículo não encontrado.", 404);
    }

    const reserva = await tx.veiculo.updateMany({
      where: { id: veiculoId, disponivel: true },
      data: { disponivel: false },
    });
    if (reserva.count === 0) {
      throw new AppError("Veículo indisponível: já possui uma locação ativa.", 409);
    }

    const quantidadeDiarias = calcularDiarias(dataInicio, dataPrevistaDevolucao);
    const valorTotal = veiculo.valorDiaria.mul(quantidadeDiarias);

    return tx.locacao.create({
      data: {
        usuarioId,
        veiculoId,
        dataInicio,
        dataPrevistaDevolucao,
        quantidadeDiarias,
        valorTotal,
      },
      include: locacaoInclude,
    });
  });
}

async function listarDoUsuario(usuarioId: number, { status }: ListarLocacoesInput) {
  return prisma.locacao.findMany({
    where: { usuarioId, status },
    include: locacaoInclude,
    orderBy: [{ status: "asc" }, { dataInicio: "desc" }],
  });
}

async function buscarDoUsuario(usuarioId: number, id: number) {
  const locacao = await prisma.locacao.findUnique({
    where: { id },
    include: locacaoInclude,
  });
  if (!locacao) {
    throw new AppError("Locação não encontrada.", 404);
  }
  if (locacao.usuarioId !== usuarioId) {
    throw new AppError("Você não tem permissão para acessar esta locação.", 403);
  }
  return locacao;
}

async function finalizar(usuarioId: number, id: number) {
  const locacao = await buscarDoUsuario(usuarioId, id);
  if (locacao.status === "FINALIZADA") {
    throw new AppError("Esta locação já foi finalizada.", 409);
  }

  return prisma.$transaction(async (tx) => {
    const encerramento = await tx.locacao.updateMany({
      where: { id, status: "ATIVA" },
      data: { status: "FINALIZADA", dataDevolucao: new Date() },
    });
    if (encerramento.count === 0) {
      throw new AppError("Esta locação já foi finalizada.", 409);
    }

    await tx.veiculo.update({
      where: { id: locacao.veiculoId },
      data: { disponivel: true },
    });

    return tx.locacao.findUniqueOrThrow({
      where: { id },
      include: locacaoInclude,
    });
  });
}

export const locacaoService = { criar, listarDoUsuario, buscarDoUsuario, finalizar };
