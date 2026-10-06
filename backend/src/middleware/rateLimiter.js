const rateLimit = require("express-rate-limit");
const env = require("../config/env");
const AppError = require("../utils/AppError");

/**
 * Strict rate limiter for auth endpoints (login / register).
 */
const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_AUTH_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new AppError("RATE_LIMITED", "Too many requests, please try again later", 429));
  },
});

/**
 * Light global limiter for all routes.
 */
const globalLimiter = rateLimit({
  windowMs: 60_000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new AppError("RATE_LIMITED", "Too many requests, please try again later", 429));
  },
});

module.exports = { authLimiter, globalLimiter };
