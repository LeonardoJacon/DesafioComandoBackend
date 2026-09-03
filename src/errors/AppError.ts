// =============================================================================
// ERRO CUSTOMIZADO DA APLICAÇÃO
// =============================================================================
// Permite lançar erros com status HTTP específico, tratados pelo middleware
// =============================================================================

export class AppError extends Error {
  /** Código HTTP que será retornado ao cliente */
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";

    // Mantém o stack trace correto em engines V8 (Node.js)
    Error.captureStackTrace(this, this.constructor);
  }
}
