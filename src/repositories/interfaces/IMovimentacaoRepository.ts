// =============================================================================
// INTERFACE DO REPOSITÓRIO DE MOVIMENTAÇÕES
// =============================================================================

import { Movimentacao, TipoMovimentacao, Prisma } from "@prisma/client";

/** Movimentação com dados do produto incluídos */
export type MovimentacaoComProduto = Prisma.MovimentacaoGetPayload<{
  include: { produto: true };
}>;

export interface CreateMovimentacaoData {
  tipo: TipoMovimentacao;
  quantidade: number;
  observacao?: string;
  produtoId: string;
}

export interface IMovimentacaoRepository {
  create(data: CreateMovimentacaoData): Promise<MovimentacaoComProduto>;
  findAll(): Promise<MovimentacaoComProduto[]>;
  findByProdutoId(produtoId: string): Promise<MovimentacaoComProduto[]>;
  findById(id: string): Promise<MovimentacaoComProduto | null>;
  /** Marca a movimentação como cancelada */
  cancelar(id: string): Promise<MovimentacaoComProduto>;
  /**
   * Executa criação de movimentação + atualização de estoque em uma transação.
   * Garante consistência: ou ambos acontecem, ou nenhum.
   */
  createWithEstoqueUpdate(
    data: CreateMovimentacaoData,
    novoEstoque: number
  ): Promise<MovimentacaoComProduto>;

  /**
   * Cancela movimentação e reverte estoque em uma transação atômica.
   */
  cancelarWithEstoqueRevert(
    id: string,
    novoEstoque: number
  ): Promise<MovimentacaoComProduto>;
}
