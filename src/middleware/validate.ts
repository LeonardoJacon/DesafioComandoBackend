import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

type ValidationTarget = "body" | "params" | "query";

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

    req[target] = result.data;
    next();
  };
}
