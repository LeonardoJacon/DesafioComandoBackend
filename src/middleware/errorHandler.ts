// =============================================================================
// MIDDLEWARE GLOBAL DE TRATAMENTO DE ERROS
// =============================================================================
// Captura qualquer erro lançado nos controllers/services e retorna JSON padronizado.
// Deve ser o ÚLTIMO middleware registrado no Express.
// =============================================================================

import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../errors/AppError";
import { env } from "../config/env";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Erros de negócio conhecidos (lançados via AppError)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  // Erros de constraint do Prisma (ex: SKU duplicado no banco)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const campo = (err.meta?.target as string[])?.join(", ") || "campo";
      res.status(409).json({
        status: "error",
        message: `Já existe um registro com este ${campo}`,
      });
      return;
    }

    if (err.code === "P2025") {
      res.status(404).json({
        status: "error",
        message: "Registro não encontrado",
      });
      return;
    }
  }

  // Erro inesperado — loga no servidor e retorna mensagem genérica
  console.error("[ERRO INTERNO]", err);

  res.status(500).json({
    status: "error",
    message: "Erro interno do servidor",
    ...(env.isDev && { stack: err.stack }),
  });
}
