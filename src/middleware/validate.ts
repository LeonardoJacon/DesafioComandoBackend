// =============================================================================
// MIDDLEWARE DE VALIDAÇÃO (Zod)
// =============================================================================
// Factory que cria um middleware Express para validar body, params ou query
// usando schemas Zod. Se inválido, retorna 400 com detalhes dos erros.
// =============================================================================

import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

type ValidationTarget = "body" | "params" | "query";

/**
 * Cria middleware de validação para o alvo especificado (body, params ou query).
 * @example validate(createCategoriaSchema, "body")
 */
export function validate(schema: ZodSchema, target: ValidationTarget = "body") {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const erros = result.error.errors.map((err) => ({
        campo: err.path.join("."),
        mensagem: err.message,
      }));

      res.status(400).json({
        status: "error",
        message: "Dados inválidos",
        erros,
      });
      return;
    }

    // Substitui os dados originais pelos dados validados/transformados pelo Zod
    req[target] = result.data;
    next();
  };
}
