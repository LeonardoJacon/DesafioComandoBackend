import express from "express";
import cors from "cors";
import { createRoutes } from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { container } from "./container";
import { rateLimiter } from "./middleware/rateLimiter";
import { httpLogger } from "./logger";


export function createApp() {
  const app = express();

  app.use(cors()); 
  app.use(express.json()); 

  app.use(httpLogger);

  app.use(rateLimiter);

  app.use(createRoutes(container));

  app.use(errorHandler);

  return app;
}
