import rateLimit from "express-rate-limit";

/**
 * Rate limiter global - 100 requisições por 15 minutos
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Muitas requisições deste IP, tente novamente mais tarde",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === "test"
});

/**
 * Rate limiter para login - 5 tentativas por 15 minutos
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Muitas tentativas de login. Tente novamente em 15 minutos",
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate limiter para registro - 3 contas por hora
 */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: "Muitos registros deste IP. Tente novamente em 1 hora",
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate limiter para API de produtos - 30 requisições por minuto
 */
export const productLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: "Muitas requisições para produtos. Tente novamente em 1 minuto",
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate limiter para endpoints de escrita (POST, PUT, DELETE) - 10 por minuto
 */
export const writeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: "Muitas operações. Tente novamente em 1 minuto",
  skip: (req) => req.method === "GET",
  standardHeaders: true,
  legacyHeaders: false
});
