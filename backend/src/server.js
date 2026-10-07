const app = require("./app");
const env = require("./config/env");
const logger = require("./config/logger");
const prisma = require("./db/prisma");

const PORT = env.PORT;

/**
 * Purges expired rows from revoked_tokens on startup and every hour.
 * Reason: The table would grow unboundedly without cleanup since JWTs
 * expire but we still store their jtis.
 */
async function purgeExpiredTokens() {
  const result = await prisma.revokedToken.deleteMany({
    where: { expires_at: { lt: new Date() } },
  });
  if (result.count > 0) {
    logger.info({ purged: result.count }, "Purged expired revoked tokens");
  }
}

app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT} in ${env.NODE_ENV} mode`);
  await purgeExpiredTokens();
  setInterval(purgeExpiredTokens, 60 * 60 * 1000); // every hour
});

