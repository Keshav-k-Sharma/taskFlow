const request = require("supertest");
const jwt = require("jsonwebtoken");
const { randomUUID } = require("node:crypto");
const app = require("../../src/app");

test("expired JWT returns 401 TOKEN_EXPIRED before database access", async () => {
  const token = jwt.sign({ sub: randomUUID(), jti: randomUUID() }, process.env.JWT_SECRET, { expiresIn: -1 });
  const res = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(401);
  expect(res.body.error.code).toBe("TOKEN_EXPIRED");
});
