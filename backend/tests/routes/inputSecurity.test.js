const request = require("supertest");
const app = require("../../src/app");
const { registerSchema } = require("../../src/validators/auth.schema");
const {
  createProjectSchema,
  updateProjectSchema,
  listProjectsSchema,
} = require("../../src/validators/project.schema");
const {
  createTaskSchema,
  updateTaskSchema,
} = require("../../src/validators/task.schema");

describe("Input security boundaries", () => {
  test("registration rejects mass-assignment before accessing the database", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        fullName: "Demo",
        email: "demo@example.com",
        password: "password123",
        role: "admin",
      });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
  test("accepts leap dates and nullable date updates", () => {
    expect(
      createProjectSchema.safeParse({ name: "Demo", startDate: "2024-02-29" })
        .success
    ).toBe(true);
    expect(updateProjectSchema.safeParse({ endDate: null }).success).toBe(true);
    expect(updateTaskSchema.safeParse({ dueDate: null }).success).toBe(true);
  });
  test.each(["2026-02-29", "2026-02-30", "2026-13-01", "2026-04-31"])(
    "rejects impossible calendar date %s",
    (date) => {
      expect(
        createProjectSchema.safeParse({ name: "Demo", startDate: date }).success
      ).toBe(false);
      expect(updateTaskSchema.safeParse({ dueDate: date }).success).toBe(false);
    }
  );
  test("rejects protected fields and unknown filters", () => {
    expect(
      registerSchema.safeParse({
        fullName: "Demo",
        email: "demo@example.com",
        password: "password123",
        role: "admin",
      }).success
    ).toBe(false);
    expect(
      createProjectSchema.safeParse({ name: "Demo", ownerId: "foreign" })
        .success
    ).toBe(false);
    expect(listProjectsSchema.safeParse({ ownerId: "foreign" }).success).toBe(
      false
    );
    expect(updateTaskSchema.safeParse({ projectId: "foreign" }).success).toBe(
      false
    );
  });
  test("accepts valid create payloads and rejects reversed project dates", () => {
    expect(
      createTaskSchema.safeParse({
        name: "Demo",
        projectId: "37a7b431-98d2-4768-b7b8-122451f7a686",
        dueDate: "2026-10-08",
      }).success
    ).toBe(true);
    expect(
      createProjectSchema.safeParse({
        name: "Demo",
        startDate: "2026-10-09",
        endDate: "2026-10-08",
      }).success
    ).toBe(false);
  });
  test("malformed JSON returns a safe validation response", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send('{"password":"sensitive-value",');
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.text).not.toContain("sensitive-value");
  });
  test("oversized JSON returns 413 without echoing the body", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ password: "x".repeat(11000) });
    expect(response.status).toBe(413);
    expect(response.body.error.code).toBe("PAYLOAD_TOO_LARGE");
  });
  test("disallowed browser origins return a deliberate CORS error", async () => {
    const response = await request(app)
      .get("/api/health")
      .set("Origin", "https://untrusted.example");
    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("CORS_NOT_ALLOWED");
    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });
  test("native requests without an Origin can reach public health", async () => {
    const response = await request(app).get("/api/health").expect(200);
    expect(response.body.status).toBe("UP");
  });
});
