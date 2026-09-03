// =============================================================================
// INTERFACE DO REPOSITÓRIO DE CATEGORIAS
// =============================================================================
// Define o contrato (o que o repositório deve fazer) sem acoplar ao Prisma.
// Isso permite trocar a implementação (ex: mock em testes) facilmente.
// =============================================================================

import { Categoria } from "@prisma/client";

/** Dados necessários para criar uma categoria */
export interface CreateCategoriaData {
  nome: string;
}

/** Dados permitidos para atualizar uma categoria */
export interface UpdateCategoriaData {
  nome: string;
}

export interface ICategoriaRepository {
  create(data: CreateCategoriaData): Promise<Categoria>;
  findAll(): Promise<Categoria[]>;
  findById(id: string): Promise<Categoria | null>;
  findByNome(nome: string): Promise<Categoria | null>;
  update(id: string, data: UpdateCategoriaData): Promise<Categoria>;
  delete(id: string): Promise<void>;
  /** Conta quantos produtos estão vinculados à categoria */
  countProdutos(categoriaId: string): Promise<number>;
}
