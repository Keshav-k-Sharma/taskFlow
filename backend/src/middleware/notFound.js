const AppError = require("../utils/AppError");

/**
 * Fallback 404 handler — registered after all routes.
 *
 * @type {import('express').RequestHandler}
 */
function notFound(req, _res, next) {
  next(new AppError("NOT_FOUND", `Route ${req.method} ${req.originalUrl} not found`, 404));
}

module.exports = notFound;

