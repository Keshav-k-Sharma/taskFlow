const AppError = require("../utils/AppError");

/**
 * Express middleware that validates req.body, req.query, and req.params
 * against provided Zod schemas. Calls next() on success, or throws
 * a 400 AppError with field-level details on failure.
 *
 * @param {{ body?: ZodSchema, query?: ZodSchema, params?: ZodSchema }} schemas
 * @returns {import('express').RequestHandler}
 */
function validate(schemas) {
  return (req, _res, next) => {
    const errors = [];

    for (const [key, schema] of Object.entries(schemas)) {
      const result = schema.safeParse(req[key]);
      if (!result.success) {
        result.error.issues.forEach((e) => {
          errors.push({ field: e.path.join("."), message: e.message });
        });
      } else {
        // Replace with the parsed (coerced/trimmed) value
        // Reason: Express 5 exposes query through a getter without a setter.
        Object.defineProperty(req, key, {
          value: result.data,
          writable: true,
          configurable: true,
          enumerable: true,
        });
      }
    }

    if (errors.length > 0) {
      throw new AppError("VALIDATION_ERROR", "Validation failed", 400, errors);
    }

    next();
  };
}

module.exports = validate;

