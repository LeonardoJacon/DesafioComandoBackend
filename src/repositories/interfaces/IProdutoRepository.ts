import { Produto, Prisma } from "@prisma/client";

export type ProdutoComCategoria = Prisma.ProdutoGetPayload<{
  include: { categoria: true };
}>;

export interface CreateProdutoData {
  nome: string;
  sku: string;
  descricao?: string;
  preco: number;
  categoriaId: string;
}

export interface UpdateProdutoData {
  nome?: string;
  descricao?: string | null;
  preco?: number;
  categoriaId?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedProdutos {
  data: ProdutoComCategoria[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IProdutoRepository {
  create(data: CreateProdutoData): Promise<ProdutoComCategoria>;
  findAllPaginated(params: PaginationParams): Promise<PaginatedProdutos>;
  findById(id: string): Promise<ProdutoComCategoria | null>;
  findBySku(sku: string): Promise<Produto | null>;
  update(id: string, data: UpdateProdutoData): Promise<ProdutoComCategoria>;
  delete(id: string): Promise<void>;
  updateEstoque(id: string, quantidade: number): Promise<Produto>;
  findByIdSimple(id: string): Promise<Produto | null>;
}
