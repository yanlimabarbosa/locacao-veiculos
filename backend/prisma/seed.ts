import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient({ adapter: new PrismaMariaDb(process.env.DATABASE_URL ?? "") });

const UM_DIA_EM_MS = 24 * 60 * 60 * 1000;

const usuarios = [
  { nome: "Yan Lima Barbosa", email: "yan@locadora.com", senha: "123456" },
  { nome: "Maria Souza", email: "maria@locadora.com", senha: "123456" },
];

const veiculos = [
  { marca: "Chevrolet", modelo: "Onix", placa: "ABC1D23", ano: 2023, valorDiaria: 129.9 },
  { marca: "Fiat", modelo: "Argo", placa: "BRA2E19", ano: 2022, valorDiaria: 119.9 },
  { marca: "Hyundai", modelo: "HB20", placa: "QWE4R56", ano: 2024, valorDiaria: 139.9 },
  { marca: "Jeep", modelo: "Compass", placa: "JPC7A88", ano: 2023, valorDiaria: 289.9 },
  { marca: "Toyota", modelo: "Corolla", placa: "TYT3C41", ano: 2024, valorDiaria: 259.9 },
  { marca: "Volkswagen", modelo: "Polo", placa: "VWP5B12", ano: 2021, valorDiaria: 124.9 },
  { marca: "Renault", modelo: "Kwid", placa: "RNK1234", ano: 2020, valorDiaria: 89.9 },
  { marca: "Honda", modelo: "HR-V", placa: "HND8F77", ano: 2024, valorDiaria: 249.9 },
];

async function main() {
  for (const usuario of usuarios) {
    const senha = await bcrypt.hash(usuario.senha, 10);
    await prisma.usuario.upsert({
      where: { email: usuario.email },
      update: {},
      create: { ...usuario, senha },
    });
  }

  for (const veiculo of veiculos) {
    await prisma.veiculo.upsert({
      where: { placa: veiculo.placa },
      update: {},
      create: veiculo,
    });
  }

  const yan = await prisma.usuario.findUniqueOrThrow({ where: { email: "yan@locadora.com" } });
  const maria = await prisma.usuario.findUniqueOrThrow({ where: { email: "maria@locadora.com" } });
  const polo = await prisma.veiculo.findUniqueOrThrow({ where: { placa: "VWP5B12" } });
  const compass = await prisma.veiculo.findUniqueOrThrow({ where: { placa: "JPC7A88" } });

  const jaPossuiLocacoes = await prisma.locacao.count();
  if (jaPossuiLocacoes > 0) {
    return;
  }

  const agora = Date.now();

  await prisma.locacao.create({
    data: {
      usuarioId: yan.id,
      veiculoId: polo.id,
      dataInicio: new Date(agora - 10 * UM_DIA_EM_MS),
      dataPrevistaDevolucao: new Date(agora - 7 * UM_DIA_EM_MS),
      dataDevolucao: new Date(agora - 7 * UM_DIA_EM_MS),
      quantidadeDiarias: 3,
      valorTotal: polo.valorDiaria.mul(3),
      status: "FINALIZADA",
    },
  });

  await prisma.$transaction([
    prisma.locacao.create({
      data: {
        usuarioId: maria.id,
        veiculoId: compass.id,
        dataInicio: new Date(agora - UM_DIA_EM_MS),
        dataPrevistaDevolucao: new Date(agora + 2 * UM_DIA_EM_MS),
        quantidadeDiarias: 3,
        valorTotal: compass.valorDiaria.mul(3),
      },
    }),
    prisma.veiculo.update({ where: { id: compass.id }, data: { disponivel: false } }),
  ]);
}

main()
  .then(() => console.log("Seed concluído."))
  .catch((erro) => {
    console.error(erro);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
