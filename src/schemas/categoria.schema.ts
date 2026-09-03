// =============================================================================
// SCHEMAS DE VALIDAÇÃO - CATEGORIAS (Zod)
// =============================================================================
// Validam o formato dos dados ANTES de chegar ao service.
// O Zod gera mensagens de erro claras automaticamente.
// =============================================================================

import { z } from "zod";

/** Validação para criar categoria */
export const createCategoriaSchema = z.object({
  nome: z
    .string({ required_error: "Nome é obrigatório" })
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim(),
});

/** Validação para atualizar categoria (apenas nome pode ser alterado) */
export const updateCategoriaSchema = createCategoriaSchema;

/** Validação do parâmetro :id na URL */
export const idParamSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});

export type CreateCategoriaInput = z.infer<typeof createCategoriaSchema>;
export type UpdateCategoriaInput = z.infer<typeof updateCategoriaSchema>;
