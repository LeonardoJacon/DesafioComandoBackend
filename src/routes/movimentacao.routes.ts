import { Router } from "express";
import { MovimentacaoController } from "../controllers/MovimentacaoController";
import { validate } from "../middleware/validate";
import { createMovimentacaoSchema } from "../schemas/movimentacao.schema";
import { idParamSchema } from "../schemas/categoria.schema";

export function createMovimentacaoRoutes(controller: MovimentacaoController): Router {
  const router = Router();

  router.post("/", validate(createMovimentacaoSchema), controller.registrar);
  router.get("/", controller.listar);
  router.delete("/:id", validate(idParamSchema, "params"), controller.cancelar);

  return router;
}
