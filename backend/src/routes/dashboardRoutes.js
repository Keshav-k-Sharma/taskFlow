const { Router } = require("express");
const { getDashboard } = require("../controllers/dashboardController");
const authenticate = require("../middleware/authenticate");

const router = Router();

router.get("/", authenticate, getDashboard);

module.exports = router;

