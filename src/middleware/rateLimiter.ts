import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
        windowMs: 10 * 60 * 1000,
        limit: 115,
        legacyHeaders: false,
        standardHeaders: 'draft-7',
        statusCode: 429,
        message: {
            error: 'Foram feitas requisições demais, por favor tente novamente mais tarde.'
        }
});