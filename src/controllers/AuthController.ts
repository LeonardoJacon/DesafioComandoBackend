import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/authService";

export class AuthController {
    constructor(private readonly authService: AuthService) {}

    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, senha, nome } = req.body;
            const user = await this.authService.register(email, senha, nome);
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, senha } = req.body;
            const result = await this.authService.login(email, senha);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
}