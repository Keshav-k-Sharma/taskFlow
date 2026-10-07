const jwt = require("jsonwebtoken");
const { randomUUID } = require("node:crypto");
const env = require("../config/env");

/**
 * Signs a JWT for the given user.
 *
 * @param {object} user - The user object.
 * @param {string} user.id - The user's UUID.
 * @returns {{ token: string, jti: string }} The signed token and its jti.
 */
function signToken(user) {
  const jti = randomUUID();
  const token = jwt.sign({ sub: user.id, jti }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
  return { token, jti };
}

/**
 * Verifies a JWT and returns its payload.
 *
 * @param {string} token - The JWT string.
 * @returns {object} The decoded payload.
 * @throws {jwt.JsonWebTokenError|jwt.TokenExpiredError}
 */
function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

module.exports = { signToken, verifyToken };

