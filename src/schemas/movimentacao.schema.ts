// =============================================================================
// SCHEMAS DE VALIDAÇÃO - MOVIMENTAÇÕES (Zod)
// =============================================================================

import { z } from "zod";

/** Tipos aceitos de movimentação */
export const tipoMovimentacaoEnum = z.enum(["ENTRADA", "SAIDA"], {
  errorMap: () => ({ message: "Tipo deve ser ENTRADA ou SAIDA" }),
});

/** Validação para registrar uma movimentação */
export const createMovimentacaoSchema = z.object({
  tipo: tipoMovimentacaoEnum,
  quantidade: z
    .number({ required_error: "Quantidade é obrigatória", invalid_type_error: "Quantidade deve ser um número" })
    .int("Quantidade deve ser um número inteiro")
    .positive("Quantidade deve ser maior que zero"),
  observacao: z.string().max(500).trim().optional(),
  produtoId: z.string().uuid("produtoId deve ser um UUID válido"),
});

export type CreateMovimentacaoInput = z.infer<typeof createMovimentacaoSchema>;
