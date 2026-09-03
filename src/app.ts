import express from "express";
import cors from "cors";
import { createRoutes } from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { container } from "./container";

export function createApp() {
  const app = express();

  app.use(cors()); 
  app.use(express.json()); 

  app.use(createRoutes(container));

  app.use(errorHandler);

  return app;
}
