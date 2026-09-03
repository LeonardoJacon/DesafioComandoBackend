import { Request, Response, NextFunction } from "express";
import { MovimentacaoService } from "../services/MovimentacaoService";

export class MovimentacaoController {
  constructor(private readonly movimentacaoService: MovimentacaoService) {}

  registrar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const movimentacao = await this.movimentacaoService.registrar(req.body);
      res.status(201).json(movimentacao);
    } catch (error) {
      next(error);
    }
  };

  listar = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const movimentacoes = await this.movimentacaoService.listar();
      res.status(200).json(movimentacoes);
    } catch (error) {
      next(error);
    }
  };

  listarPorProduto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const movimentacoes = await this.movimentacaoService.listarPorProduto(String(req.params.id));
      res.status(200).json(movimentacoes);
    } catch (error) {
      next(error);
    }
  };

  cancelar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const movimentacao = await this.movimentacaoService.cancelar(String(req.params.id));
      res.status(200).json(movimentacao);
    } catch (error) {
      next(error);
    }
  };
}
