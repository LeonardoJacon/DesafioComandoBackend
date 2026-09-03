import { Response, Request, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
const authorization = req.headers.authorization;
if (!authorization) {
    return res.status(401).json({ message: "Token não fornecido!" });  
    }
    const [type, token] = authorization.split(" ");
    if (type !== "Bearer" || !token) {
        return res.status(401).json({ message: "Token inválido!" });
    }
    try{
    const decoded = verifyToken(token);
    console.log(decoded);
    next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido ou expirado!" });
    }   

}