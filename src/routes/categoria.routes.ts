// =============================================================================
// ROTAS DE CATEGORIAS
// =============================================================================

import { Router } from "express";
import { CategoriaController } from "../controllers/CategoriaController";
import { validate } from "../middleware/validate";
import {
  createCategoriaSchema,
  updateCategoriaSchema,
  idParamSchema,
} from "../schemas/categoria.schema";

export function createCategoriaRoutes(controller: CategoriaController): Router {
  const router = Router();

  router.post("/", validate(createCategoriaSchema), controller.criar);
  router.get("/", controller.listar);
  router.get("/:id", validate(idParamSchema, "params"), controller.buscarPorId);
  router.put("/:id", validate(idParamSchema, "params"), validate(updateCategoriaSchema), controller.atualizar);
  router.delete("/:id", validate(idParamSchema, "params"), controller.deletar);

  return router;
}
