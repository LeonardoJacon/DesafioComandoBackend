import { Router } from "express";
import { ProdutoController } from "../controllers/ProdutoController";
import { MovimentacaoController } from "../controllers/MovimentacaoController";
import { validate } from "../middleware/validate";
import {
  createProdutoSchema,
  updateProdutoSchema,
  paginationQuerySchema,
} from "../schemas/produto.schema";
import { idParamSchema } from "../schemas/categoria.schema";

export function createProdutoRoutes(
  produtoController: ProdutoController,
  movimentacaoController: MovimentacaoController
): Router {
  const router = Router();

  router.post("/", validate(createProdutoSchema), produtoController.criar);
  router.get("/", validate(paginationQuerySchema, "query"), produtoController.listar);
  router.get("/:id", validate(idParamSchema, "params"), produtoController.buscarPorId);
  router.put(
    "/:id",
    validate(idParamSchema, "params"),
    validate(updateProdutoSchema),
    produtoController.atualizar
  );
  router.delete("/:id", validate(idParamSchema, "params"), produtoController.deletar);

  router.get(
    "/:id/movimentacoes",
    validate(idParamSchema, "params"),
    movimentacaoController.listarPorProduto
  );

  return router;
}
