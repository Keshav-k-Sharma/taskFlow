const express = require("express");
const request = require("supertest");
const { authLimiter } = require("../../src/middleware/rateLimiter");
const errorHandler = require("../../src/middleware/errorHandler");

test("the sixth auth attempt returns 429 RATE_LIMITED", async () => {
  const app = express();
  app.post("/login", authLimiter, (_req, res) => res.sendStatus(401));
  app.use(errorHandler);
  for (let attempt = 0; attempt < 5; attempt += 1) {
    expect((await request(app).post("/login")).status).toBe(401);
  }
  const res = await request(app).post("/login");
  expect(res.status).toBe(429);
  expect(res.body.error.code).toBe("RATE_LIMITED");
});
