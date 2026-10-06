const pino = require("pino");
const env = require("./env");

/**
 * Application logger. Redacts sensitive fields from output.
 */
const logger = pino({
  level: env.LOG_LEVEL,
  redact: {
    paths: ["req.headers.authorization", "body.password", "body.passwordHash"],
    censor: "[REDACTED]",
  },
  ...(env.NODE_ENV === "development" && {
    transport: {
      target: "pino-pretty",
      options: { colorize: true },
    },
  }),
});

module.exports = logger;
