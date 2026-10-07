const express = require("express");
const request = require("supertest");
const { z } = require("zod");
const validate = require("../../src/middleware/validate");
const errorHandler = require("../../src/middleware/errorHandler");

const app = express();
app.use(express.json());
app.post("/", validate({ body: z.object({ name: z.string().trim().min(1) }).strict() }),
  (req, res) => res.json(req.body));
app.get("/", validate({ query: z.object({ search: z.string().trim() }) }),
  (req, res) => res.json(req.query));
app.use(errorHandler);

describe("request validation", () => {
  test("returns trimmed body fields", async () => {
    const res = await request(app).post("/").send({ name: "  Task  " });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ name: "Task" });
  });
  test("replaces Express 5 query getter with parsed values", async () => {
    const res = await request(app).get("/").query({ search: "  Task  " });
    expect(res.status).toBe(200);
    expect(res.body.search).toBe("Task");
  });
  test("returns Zod 4 field errors for whitespace-only names", async () => {
    const res = await request(app).post("/").send({ name: "  " });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(res.body.error.details[0].field).toBe("name");
  });
  test("rejects protected fields with a strict schema", async () => {
    const res = await request(app).post("/").send({ name: "Task", ownerId: "other" });
    expect(res.status).toBe(400);
  });
});
