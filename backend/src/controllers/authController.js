const authService = require("../services/auth.service");

/**
 * POST /api/auth/register
 * @type {import('express').RequestHandler}
 */
async function registerUser(req, res) {
  const result = await authService.register(req.body);
  res.status(201).json(result);
}

/**
 * POST /api/auth/login
 * @type {import('express').RequestHandler}
 */
async function loginUser(req, res) {
  const result = await authService.login(req.body);
  res.json(result);
}

/**
 * POST /api/auth/logout
 * @type {import('express').RequestHandler}
 */
async function logoutUser(req, res) {
  await authService.logout(req.jti, req.tokenExp);
  res.status(204).send();
}

/**
 * GET /api/auth/me
 * @type {import('express').RequestHandler}
 */
function getMe(req, res) {
  res.json({ user: authService.me(req.user) });
}

module.exports = { registerUser, loginUser, logoutUser, getMe };