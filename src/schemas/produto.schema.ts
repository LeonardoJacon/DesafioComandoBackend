import { z } from "zod";

export const createProdutoSchema = z
  .object({
    nome: z
      .string({ required_error: "Nome é obrigatório" })
      .min(2, "Nome deve ter no mínimo 2 caracteres")
      .max(200, "Nome deve ter no máximo 200 caracteres")
      .trim(),
    sku: z
      .string({ required_error: "SKU é obrigatório" })
      .min(1, "SKU não pode ser vazio")
      .max(50, "SKU deve ter no máximo 50 caracteres")
      .trim()
      .toUpperCase(),
    descricao: z.string().max(500).trim().optional(),
    preco: z
      .number({ required_error: "Preço é obrigatório", invalid_type_error: "Preço deve ser um número" })
      .positive("Preço deve ser maior que zero"),
    categoriaId: z.string().uuid("categoriaId deve ser um UUID válido"),
  })
  .strict()
  .refine((data) => !("quantidadeEstoque" in data) && !("quantidade_estoque" in data), {
    message: "Não é permitido definir estoque na criação do produto. O estoque inicial é sempre 0.",
  });
export const updateProdutoSchema = z
  .object({
    nome: z.string().min(2).max(200).trim().optional(),
    descricao: z.string().max(500).trim().nullable().optional(),
    preco: z.number().positive("Preço deve ser maior que zero").optional(),
    categoriaId: z.string().uuid().optional(),
  })
  .strict()
  .refine((data) => !("quantidadeEstoque" in data) && !("quantidade_estoque" in data), {
    message: "Não é permitido atualizar quantidade_estoque manualmente. Use movimentações.",
  });

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type CreateProdutoInput = z.infer<typeof createProdutoSchema>;
export type UpdateProdutoInput = z.infer<typeof updateProdutoSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
