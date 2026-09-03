// =============================================================================
// CLIENTE PRISMA (SINGLETON)
// =============================================================================
// Uma única instância do Prisma Client é compartilhada em toda a aplicação.
// Em desenvolvimento, guardamos no globalThis para evitar múltiplas conexões
// durante hot-reload do tsx watch.
// =============================================================================

import { PrismaClient } from "@prisma/client";

// Declaração para estender o global do Node com nossa instância
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/** Instância única do Prisma Client */
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Em dev, reutiliza a mesma instância entre recarregamentos
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
