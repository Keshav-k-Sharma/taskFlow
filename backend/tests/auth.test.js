const request = require("supertest");
const app = require("../src/app");
const { prisma, cleanDatabase } = require("./helpers/db");

const BASE = "/api/auth";

/**
 * Helper: register a user and return the token.
 * @param {object} overrides
 * @returns {Promise<{ token: string, user: object }>}
 */
async function registerUser(overrides = {}) {
  const data = {
    fullName: "Test User",
    email: `test_${Date.now()}@example.com`,
    password: "password123",
    ...overrides,
  };
  const res = await request(app).post(`${BASE}/register`).send(data);
  return res.body;
}

beforeAll(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
});

// â”€â”€â”€ Register â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

describe("POST /api/auth/register", () => {
  test("4.2a â€” registers successfully and returns token + user (no passwordHash)", async () => {
    const res = await request(app).post(`${BASE}/register`).send({
      fullName: "Alice",
      email: "alice@example.com",
      password: "securepass123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).not.toHaveProperty("password_hash");
    expect(res.body.user).not.toHaveProperty("passwordHash");
    expect(res.body.user.email).toBe("alice@example.com");
  });

  test("4.2b â€” rejects duplicate email with 409 EMAIL_TAKEN", async () => {
    await request(app).post(`${BASE}/register`).send({
      fullName: "Bob",
      email: "bob@example.com",
      password: "password123",
    });

    const res = await request(app).post(`${BASE}/register`).send({
      fullName: "Bob Again",
      email: "bob@example.com",
      password: "password456",
    });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("EMAIL_TAKEN");
  });

  test("4.2c â€” rejects invalid email with 400 VALIDATION_ERROR", async () => {
    const res = await request(app).post(`${BASE}/register`).send({
      fullName: "Charlie",
      email: "not-an-email",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  test("4.2d â€” rejects password shorter than 8 chars with 400", async () => {
    const res = await request(app).post(`${BASE}/register`).send({
      fullName: "Dave",
      email: "dave@example.com",
      password: "short",
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  test("4.2e â€” rejects `role` field in request body (no privilege escalation)", async () => {
    const res = await request(app).post(`${BASE}/register`).send({
      fullName: "Eve",
      email: "eve@example.com",
      password: "password123",
      role: "admin",
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});

// â”€â”€â”€ Login â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

describe("POST /api/auth/login", () => {
  beforeAll(async () => {
    await request(app).post(`${BASE}/register`).send({
      fullName: "Frank",
      email: "frank@example.com",
      password: "frankpass123",
    });
  });

  test("4.3a â€” logs in successfully and returns token", async () => {
    const res = await request(app).post(`${BASE}/login`).send({
      email: "frank@example.com",
      password: "frankpass123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe("frank@example.com");
  });

  test("4.3b â€” wrong password returns 401 with generic message", async () => {
    const res = await request(app).post(`${BASE}/login`).send({
      email: "frank@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe("Invalid email or password");
  });

  test("4.3c â€” unknown email returns 401 with same generic message", async () => {
    const res = await request(app).post(`${BASE}/login`).send({
      email: "nobody@example.com",
      password: "password123",
    });

    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe("Invalid email or password");
  });
});

// â”€â”€â”€ /me â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

describe("GET /api/auth/me", () => {
  let token;

  beforeAll(async () => {
    const { token: t } = await registerUser({ email: "meuser@example.com" });
    token = t;
  });

  test("4.4a â€” returns user profile with valid token", async () => {
    const res = await request(app)
      .get(`${BASE}/me`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty("email", "meuser@example.com");
    expect(res.body.user).not.toHaveProperty("password_hash");
  });

  test("4.4b â€” no token returns 401 UNAUTHENTICATED", async () => {
    const res = await request(app).get(`${BASE}/me`);
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHENTICATED");
  });

  test("4.4c â€” invalid token returns 401", async () => {
    const res = await request(app)
      .get(`${BASE}/me`)
      .set("Authorization", "Bearer invalidtoken.abc.def");

    expect(res.status).toBe(401);
  });
});

// â”€â”€â”€ Logout & revocation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

describe("POST /api/auth/logout", () => {
  let token;

  beforeAll(async () => {
    const { token: t } = await registerUser({ email: "logout@example.com" });
    token = t;
  });

  test("4.4d â€” logout revokes token; subsequent /me returns 401", async () => {
    const logoutRes = await request(app)
      .post(`${BASE}/logout`)
      .set("Authorization", `Bearer ${token}`);

    expect(logoutRes.status).toBe(204);

    // Token should now be rejected
    const meRes = await request(app)
      .get(`${BASE}/me`)
      .set("Authorization", `Bearer ${token}`);

    expect(meRes.status).toBe(401);
    expect(meRes.body.error.code).toBe("UNAUTHENTICATED");
  });
});


