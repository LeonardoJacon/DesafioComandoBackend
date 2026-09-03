import pino from "pino";
import { pinoHttp } from "pino-http";
export const logger = pino({
  level: "info"
});

export const httpLogger = pinoHttp({
  logger: logger,
  redact: ["req.headers.authorization", "res.headers.authorization"]
});