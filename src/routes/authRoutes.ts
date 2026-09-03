import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

export function createAuthRoutes(controller: AuthController): Router {
    const router = Router();
    router.post("/register", controller.register.bind(controller));
    router.post("/login", controller.login.bind(controller));
    return router;
}