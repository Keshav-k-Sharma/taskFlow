/**
 * Standard application error class.
 * Thrown from services/controllers to produce predictable HTTP responses.
 */
class AppError extends Error {
  /**
   * @param {string} code - Machine-readable error code (e.g. "NOT_FOUND").
   * @param {string} message - Human-readable message.
   * @param {number} statusCode - HTTP status code.
   * @param {Array} [details] - Optional array of field-level errors.
   */
  constructor(code, message, statusCode = 500, details = []) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
  }
}

module.exports = AppError;
