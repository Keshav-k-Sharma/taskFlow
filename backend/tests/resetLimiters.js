const { authLimiter, globalLimiter } = require("../src/middleware/rateLimiter");

beforeEach(() => {
  // Reason: Isolate tests without changing production limits or mocking middleware.
  for (const address of ["127.0.0.1", "::ffff:127.0.0.1", "::/56"]) {
    authLimiter.resetKey(address);
    globalLimiter.resetKey(address);
  }
});
