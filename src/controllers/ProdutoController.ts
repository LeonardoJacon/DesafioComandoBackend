// =============================================================================
// CONTROLLER DE PRODUTOS
// =============================================================================

import { Request, Response, NextFunction } from "express";
import { ProdutoService } from "../services/ProdutoService";

export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  criar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const produto = await this.produtoService.criar(req.body);
      res.status(201).json(produto);
    } catch (error) {
      next(error);
    }
  };

  listar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resultado = await this.produtoService.listar({
        page: req.query.page as unknown as number,
        limit: req.query.limit as unknown as number,
      });
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  };

  buscarPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const produto = await this.produtoService.buscarPorId(String(req.params.id));
      res.status(200).json(produto);
    } catch (error) {
      next(error);
    }
  };

  atualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const produto = await this.produtoService.atualizar(String(req.params.id), req.body);
      res.status(200).json(produto);
    } catch (error) {
      next(error);
    }
  };

  deletar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.produtoService.deletar(String(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
