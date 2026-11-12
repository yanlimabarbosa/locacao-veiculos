import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";
import { prisma } from "../lib/prisma.js";
import type { CadastroInput, LoginInput } from "../schemas/auth-schemas.js";

const SALT_ROUNDS = 10;

export const usuarioPublicoSelect = {
  id: true,
  nome: true,
  email: true,
  criadoEm: true,
} as const;

async function cadastrar({ nome, email, senha }: CadastroInput) {
  const emailEmUso = await prisma.usuario.findUnique({ where: { email } });
  if (emailEmUso) {
    throw new AppError("Já existe um usuário cadastrado com este e-mail.", 409);
  }

  const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

  return prisma.usuario.create({
    data: { nome, email, senha: senhaHash },
    select: usuarioPublicoSelect,
  });
}

async function login({ email, senha }: LoginInput) {
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  const senhaConfere = usuario ? await bcrypt.compare(senha, usuario.senha) : false;

  if (!usuario || !senhaConfere) {
    throw new AppError("E-mail ou senha inválidos.", 401);
  }

  const token = jwt.sign({}, env.JWT_SECRET, {
    subject: String(usuario.id),
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      criadoEm: usuario.criadoEm,
    },
  };
}

async function buscarPorId(id: number) {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
    select: usuarioPublicoSelect,
  });
  if (!usuario) {
    throw new AppError("Usuário não encontrado.", 404);
  }
  return usuario;
}

export const authService = { cadastrar, login, buscarPorId };
