require("dotenv").config();
const env = require("./config/env"); // Validates env — must load before anything else

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const pinoHttp = require("pino-http");
const logger = require("./config/logger");
const { globalLimiter } = require("./middleware/rateLimiter");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Reason: Trust proxy so rate limiting sees real IPs behind Render/Vercel
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// CORS — allowlist from env; mobile has no Origin header and is allowed
const allowedOrigins = env.CORS_ORIGINS.split(",").map((o) => o.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no Origin (mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("CORS policy violation"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// HTTP request logging
app.use(pinoHttp({ logger }));

// Body parsing
app.use(express.json({ limit: "10kb" }));

// Global rate limiter
app.use(globalLimiter);

// Health check (no auth)
app.get("/api/health", (_req, res) => {
  res.json({ status: "UP" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 + central error handler (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;

