import { Movimentacao, TipoMovimentacao, Prisma } from "@prisma/client";

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
  cancelar(id: string): Promise<MovimentacaoComProduto>;
  createWithEstoqueUpdate(
    data: CreateMovimentacaoData,
    novoEstoque: number
  ): Promise<MovimentacaoComProduto>;

  cancelarWithEstoqueRevert(
    id: string,
    novoEstoque: number
  ): Promise<MovimentacaoComProduto>;
}
