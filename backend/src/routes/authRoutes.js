const { Router } = require("express");
const { registerUser, loginUser, logoutUser, getMe } = require("../controllers/authController");
const validate = require("../middleware/validate");
const authenticate = require("../middleware/authenticate");
const { authLimiter } = require("../middleware/rateLimiter");
const { registerSchema, loginSchema } = require("../validators/auth.schema");

const router = Router();

router.post("/register", authLimiter, validate({ body: registerSchema }), registerUser);
router.post("/login", authLimiter, validate({ body: loginSchema }), loginUser);
router.post("/logout", authenticate, logoutUser);
router.get("/me", authenticate, getMe);

module.exports = router;
