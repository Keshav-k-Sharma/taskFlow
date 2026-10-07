const logger = require("../config/logger");

/**
 * Central error handler — must be registered AFTER all routes.
 * Produces the standard error shape from PLANNING §7.
 * Hides stack traces in production.
 *
 * @type {import('express').ErrorRequestHandler}
 */
function errorHandler(err, req, res, _next) {
  // Operational errors: AppError instances
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details.length > 0 && { details: err.details }),
      },
    });
  }

  // Prisma unique constraint violation → 409
  if (err.code === "P2002") {
    return res.status(409).json({
      error: { code: "EMAIL_TAKEN", message: "Email already in use" },
    });
  }

  // Unknown / programmer errors
  logger.error({ err, req: { method: req.method, url: req.url } }, "Unhandled error");

  const isProd = process.env.NODE_ENV === "production";
  return res.status(500).json({
    error: {
      code: "INTERNAL",
      message: isProd ? "An unexpected error occurred" : err.message,
    },
  });
}

module.exports = errorHandler;

