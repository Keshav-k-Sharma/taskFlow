const bcrypt = require("bcryptjs");
const prisma = require("../db/prisma");
const AppError = require("../utils/AppError");
const { signToken } = require("../utils/token");

/** @typedef {{ id: string, fullName: string, email: string, createdAt: string }} SafeUser */

/**
 * Serializes a user record removing sensitive fields.
 *
 * @param {object} user - Raw user from Prisma.
 * @returns {SafeUser}
 */
function serializeUser(user) {
  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    createdAt: user.created_at,
  };
}

/**
 * Registers a new user.
 * Ignores any `role` field from input. Email is stored lowercased.
 *
 * @param {{ fullName: string, email: string, password: string }} data
 * @returns {Promise<{ token: string, user: SafeUser }>}
 * @throws {AppError} 409 EMAIL_TAKEN if email already exists.
 */
async function register(data) {
  const { fullName, email, password } = data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError("EMAIL_TAKEN", "Email already in use", 409);
  }

  const password_hash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { full_name: fullName, email, password_hash },
  });

  const { token } = signToken(user);
  return { token, user: serializeUser(user) };
}

/**
 * Authenticates a user by email and password.
 *
 * @param {{ email: string, password: string }} data
 * @returns {Promise<{ token: string, user: SafeUser }>}
 * @throws {AppError} 401 INVALID_CREDENTIALS on any mismatch (generic message).
 */
async function login(data) {
  const { email, password } = data;

  // Reason: Generic message for both unknown email and wrong password (security)
  const GENERIC_ERROR = new AppError(
    "INVALID_CREDENTIALS",
    "Invalid email or password",
    401
  );

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw GENERIC_ERROR;

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw GENERIC_ERROR;

  const { token } = signToken(user);
  return { token, user: serializeUser(user) };
}

/**
 * Revokes the current JWT by inserting its jti into revoked_tokens.
 *
 * @param {string} jti - The JWT ID from the token payload.
 * @param {number} exp - The token's expiry timestamp (seconds).
 * @returns {Promise<void>}
 */
async function logout(jti, exp) {
  await prisma.revokedToken.create({
    data: {
      jti,
      expires_at: new Date(exp * 1000),
    },
  });
}

/**
 * Returns the authenticated user's profile.
 *
 * @param {object} user - The user object from req.user.
 * @returns {SafeUser}
 */
function me(user) {
  return serializeUser(user);
}

module.exports = { register, login, logout, me };

