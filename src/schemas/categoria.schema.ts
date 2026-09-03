import { z } from "zod";

export const createCategoriaSchema = z.object({
  nome: z
    .string({ required_error: "Nome é obrigatório" })
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim(),
});

export const updateCategoriaSchema = createCategoriaSchema;

export const idParamSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});

export type CreateCategoriaInput = z.infer<typeof createCategoriaSchema>;
export type UpdateCategoriaInput = z.infer<typeof updateCategoriaSchema>;
