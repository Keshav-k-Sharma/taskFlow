const jwt = require("jsonwebtoken");
const prisma = require("../db/prisma");
const AppError = require("../utils/AppError");
const { verifyToken } = require("../utils/token");

/**
 * Protects routes by verifying the Bearer JWT.
 * Maps jwt errors to 401 — never 500.
 * Sets req.user to the full user record (without password_hash).
 *
 * @throws {AppError} 401 UNAUTHENTICATED if no/invalid token.
 * @throws {AppError} 401 TOKEN_EXPIRED if token has expired.
 */
async function authenticate(req, _res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("UNAUTHENTICATED", "No token provided", 401);
  }

  const token = authHeader.split(" ")[1];

  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new AppError("TOKEN_EXPIRED", "Session expired, please log in again", 401);
    }
    throw new AppError("UNAUTHENTICATED", "Invalid token", 401);
  }

  // Reason: Check revocation table before trusting the token
  const revoked = await prisma.revokedToken.findUnique({
    where: { jti: payload.jti },
  });
  if (revoked) {
    throw new AppError("UNAUTHENTICATED", "Token has been revoked", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      full_name: true,
      email: true,
      created_at: true,
      updated_at: true,
    },
  });

  if (!user) {
    throw new AppError("UNAUTHENTICATED", "User no longer exists", 401);
  }

  req.user = user;
  req.jti = payload.jti;
  req.tokenExp = payload.exp;
  next();
}

module.exports = authenticate;
