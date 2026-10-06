const dashboardService = require("../services/dashboard.service");

/**
 * GET /api/dashboard
 * @type {import('express').RequestHandler}
 */
async function getDashboard(req, res) {
  const stats = await dashboardService.getDashboard(req.user.id);
  res.json(stats);
}

module.exports = { getDashboard };
