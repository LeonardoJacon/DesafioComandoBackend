// =============================================================================
// CONFIGURAÇÃO DE VARIÁVEIS DE AMBIENTE
// =============================================================================
// Centraliza o acesso às variáveis do .env com valores padrão seguros
// =============================================================================

import dotenv from "dotenv";

dotenv.config();

export const env = {
  /** Porta HTTP da API */
  port: Number(process.env.PORT) || 3000,

  /** URL de conexão com o PostgreSQL */
  databaseUrl: process.env.DATABASE_URL || "",

  /** Ambiente: development | production | test */
  nodeEnv: process.env.NODE_ENV || "development",

  /** Indica se estamos em modo de desenvolvimento */
  isDev: process.env.NODE_ENV !== "production",
};
