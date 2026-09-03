// =============================================================================
// ROTAS PRINCIPAIS
// =============================================================================
// Agrupa todas as rotas da API sob seus respectivos prefixos.
// =============================================================================

import { Router } from "express";
import { Container } from "../container";
import { createCategoriaRoutes } from "./categoria.routes";
import { createProdutoRoutes } from "./produto.routes";
import { createMovimentacaoRoutes } from "./movimentacao.routes";

export function createRoutes(container: Container): Router {
  const router = Router();

  router.use("/categorias", createCategoriaRoutes(container.categoriaController));
  router.use(
    "/produtos",
    createProdutoRoutes(container.produtoController, container.movimentacaoController)
  );
  router.use("/movimentacoes", createMovimentacaoRoutes(container.movimentacaoController));

  // Rota de health check para verificar se a API está no ar
  router.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  return router;
}
