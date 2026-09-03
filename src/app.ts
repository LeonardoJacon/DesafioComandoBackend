// =============================================================================
// CONFIGURAÇÃO DO EXPRESS (APP)
// =============================================================================
// Cria e configura a instância do Express com middlewares globais e rotas.
// =============================================================================

import express from "express";
import cors from "cors";
import { createRoutes } from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { container } from "./container";

export function createApp() {
  const app = express();

  // Middlewares globais
  app.use(cors()); // Permite requisições de outros domínios (útil para frontends)
  app.use(express.json()); // Parse automático de JSON no body

  // Registra todas as rotas da API
  app.use(createRoutes(container));

  // Middleware de erro — SEMPRE por último
  app.use(errorHandler);

  return app;
}
