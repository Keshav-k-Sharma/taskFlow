const request = require("supertest");
const YAML = require("yaml");
const app = require("../../src/app");

describe("Public API documentation", () => {
  test("serves Swagger UI without requiring a token", async () => {
    const response = await request(app).get("/api/docs/").expect(200);
    expect(response.text).toContain("swagger-ui");
    expect(response.headers["content-security-policy"]).toContain(
      "script-src 'self'"
    );
  });

  test("redirects the bare docs path so relative assets resolve", async () => {
    const response = await request(app).get("/api/docs").expect(301);
    expect(response.headers.location).toBe("/api/docs/");
    await request(app).get("/api/docs/swagger-ui-bundle.js").expect(200);
  });

  test("exports the API contract with bearer security and ownership errors", async () => {
    const response = await request(app)
      .get("/api/docs/openapi.yaml")
      .expect(200);
    const spec = YAML.parse(response.text);
    expect(spec.openapi).toBe("3.0.3");
    expect(spec.paths["/projects/{id}"].get.responses["404"]).toBeDefined();
    expect(spec.components.securitySchemes.bearerAuth.scheme).toBe("bearer");
    expect(spec.paths["/auth/register"].post.security).toEqual([]);
  });

  test("does not make protected resources public", async () => {
    await request(app).get("/api/projects").expect(401);
    await request(app).get("/api/tasks").expect(401);
  });

  test("keeps unknown API routes in the standard error format", async () => {
    const response = await request(app)
      .get("/api/nonexistent-docs")
      .expect(404);
    expect(response.body.error.code).toBe("NOT_FOUND");
  });
});
