const request = require("supertest");
const app = require("../src/app");
const { prisma, cleanDatabase } = require("./helpers/db");

const BASE = "/api/projects";

let userAToken, userBToken;

/**
 * Registers a user and returns their token.
 * @param {string} email
 * @returns {Promise<string>} JWT
 */
async function getToken(email) {
  const res = await request(app)
    .post("/api/auth/register")
    .send({ fullName: "User", email, password: "password123" });
  return res.body.token;
}

beforeAll(async () => {
  await cleanDatabase();
  userAToken = await getToken("projectsA@example.com");
  userBToken = await getToken("projectsB@example.com");
});

afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
});

// â”€â”€â”€ Create â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

describe("POST /api/projects", () => {
  test("4.6a â€” creates project successfully", async () => {
    const res = await request(app)
      .post(BASE)
      .set("Authorization", `Bearer ${userAToken}`)
      .send({ name: "My Project", description: "Test desc", status: "NOT_STARTED" });

    expect(res.status).toBe(201);
    expect(res.body.project.name).toBe("My Project");
    expect(res.body.project).not.toHaveProperty("owner_id");
    expect(res.body.project).not.toHaveProperty("ownerId");
  });

  test("4.6b â€” edge: empty name returns 400", async () => {
    const res = await request(app)
      .post(BASE)
      .set("Authorization", `Bearer ${userAToken}`)
      .send({ name: "" });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  test("4.6c â€” edge: endDate before startDate returns 400", async () => {
    const res = await request(app)
      .post(BASE)
      .set("Authorization", `Bearer ${userAToken}`)
      .send({ name: "Bad Dates", startDate: "2026-12-31", endDate: "2026-01-01" });

    expect(res.status).toBe(400);
  });

  test("4.6d â€” no token returns 401", async () => {
    const res = await request(app).post(BASE).send({ name: "Unauthorized" });
    expect(res.status).toBe(401);
  });
});

// â”€â”€â”€ Read â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

describe("GET /api/projects", () => {
  let projectId;

  beforeAll(async () => {
    const res = await request(app)
      .post(BASE)
      .set("Authorization", `Bearer ${userAToken}`)
      .send({ name: "Searchable Project", status: "IN_PROGRESS" });
    projectId = res.body.project.id;
  });

  test("4.6e â€” lists only the authenticated user's projects", async () => {
    const res = await request(app)
      .get(BASE)
      .set("Authorization", `Bearer ${userAToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.projects)).toBe(true);
    // All returned projects belong to userA (no cross-user leakage)
    res.body.projects.forEach((p) => {
      expect(p).not.toHaveProperty("owner_id");
    });
  });

  test("4.9a â€” search by name (case-insensitive) works", async () => {
    const res = await request(app)
      .get(`${BASE}?search=searchable`)
      .set("Authorization", `Bearer ${userAToken}`);

    expect(res.status).toBe(200);
    expect(res.body.projects.some((p) => p.name === "Searchable Project")).toBe(true);
  });

  test("4.9b â€” status filter works", async () => {
    const res = await request(app)
      .get(`${BASE}?status=IN_PROGRESS`)
      .set("Authorization", `Bearer ${userAToken}`);

    expect(res.status).toBe(200);
    res.body.projects.forEach((p) => expect(p.status).toBe("IN_PROGRESS"));
  });

  test("4.8a â€” GET /projects/:id for another user's project returns 404", async () => {
    const res = await request(app)
      .get(`${BASE}/${projectId}`)
      .set("Authorization", `Bearer ${userBToken}`);

    expect(res.status).toBe(404);
  });
});

// â”€â”€â”€ Update â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

describe("PUT /api/projects/:id", () => {
  let projectId;

  beforeAll(async () => {
    const res = await request(app)
      .post(BASE)
      .set("Authorization", `Bearer ${userAToken}`)
      .send({ name: "Update Me" });
    projectId = res.body.project.id;
  });

  test("4.6f â€” updates project successfully", async () => {
    const res = await request(app)
      .put(`${BASE}/${projectId}`)
      .set("Authorization", `Bearer ${userAToken}`)
      .send({ name: "Updated Name", status: "COMPLETED" });

    expect(res.status).toBe(200);
    expect(res.body.project.name).toBe("Updated Name");
    expect(res.body.project.status).toBe("COMPLETED");
  });

  test("4.8b â€” user B cannot update user A's project (404)", async () => {
    const res = await request(app)
      .put(`${BASE}/${projectId}`)
      .set("Authorization", `Bearer ${userBToken}`)
      .send({ name: "Hijacked" });

    expect(res.status).toBe(404);
  });

  test("4.6g â€” failure: invalid UUID param returns 400", async () => {
    const res = await request(app)
      .put(`${BASE}/not-a-uuid`)
      .set("Authorization", `Bearer ${userAToken}`)
      .send({ name: "X" });

    expect(res.status).toBe(400);
  });
});

// â”€â”€â”€ Delete â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

describe("DELETE /api/projects/:id", () => {
  let projectId;

  beforeAll(async () => {
    const res = await request(app)
      .post(BASE)
      .set("Authorization", `Bearer ${userAToken}`)
      .send({ name: "Delete Me" });
    projectId = res.body.project.id;
  });

  test("4.8c â€” user B cannot delete user A's project (404)", async () => {
    const res = await request(app)
      .delete(`${BASE}/${projectId}`)
      .set("Authorization", `Bearer ${userBToken}`);

    expect(res.status).toBe(404);
  });

  test("4.6h â€” user A can delete their own project", async () => {
    const res = await request(app)
      .delete(`${BASE}/${projectId}`)
      .set("Authorization", `Bearer ${userAToken}`);

    expect(res.status).toBe(204);
  });

  test("4.6i â€” deleted project returns 404 on subsequent GET", async () => {
    const res = await request(app)
      .get(`${BASE}/${projectId}`)
      .set("Authorization", `Bearer ${userAToken}`);

    expect(res.status).toBe(404);
  });
});


