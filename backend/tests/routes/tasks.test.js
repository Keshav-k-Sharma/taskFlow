const request = require("supertest");
const app = require("../../src/app");
const { prisma, cleanDatabase } = require("../helpers/db");
let tokenA, tokenB, projectId, taskId;

/**
 * Sends an authenticated API request.
 * @param {string} method - HTTP method.
 * @param {string} path - API path.
 * @param {string} token - Auth token.
 * @returns {object} Supertest request.
 */
function api(method, path, token = tokenA) {
  return request(app)[method](path).set("Authorization", `Bearer ${token}`);
}

beforeAll(async () => {
  await cleanDatabase();
  for (const email of ["tasks-a@example.com", "tasks-b@example.com"]) {
    const res = await request(app).post("/api/auth/register").send({ fullName: "Test User", email, password: "password123" });
    expect(res.status).toBe(201);
    if (tokenA) tokenB = res.body.token;
    else tokenA = res.body.token;
  }
  const project = await api("post", "/api/projects").send({ name: "Task project", status: "IN_PROGRESS" });
  expect(project.status).toBe(201);
  projectId = project.body.project.id;
});
afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
});

test("creates a task without due date and with default enums", async () => {
  const res = await api("post", "/api/tasks").send({ name: "Searchable task", projectId });
  expect(res.status).toBe(201);
  expect(res.body.task).toMatchObject({ dueDate: null, priority: "MEDIUM", status: "PENDING" });
  taskId = res.body.task.id;
});
test("rejects an invalid enum", async () => {
  const res = await api("post", "/api/tasks").send({ name: "Invalid", projectId, priority: "URGENT" });
  expect(res.status).toBe(400);
});
test("another user cannot create tasks in the project", async () => {
  expect((await api("post", "/api/tasks", tokenB).send({ name: "Forbidden", projectId })).status).toBe(404);
});
test.each(["get", "put", "delete"])("another user cannot %s a task", async (method) => {
  const req = api(method, `/api/tasks/${taskId}`, tokenB);
  expect((await (method === "put" ? req.send({ name: "Hijack" }) : req)).status).toBe(404);
});
test.each([
  ["get", "/api/tasks"], ["post", "/api/tasks"], ["get", "/api/tasks/:id"],
  ["put", "/api/tasks/:id"], ["delete", "/api/tasks/:id"], ["get", "/api/dashboard"],
  ["get", "/api/projects"], ["post", "/api/projects"], ["get", "/api/projects/:id"],
  ["put", "/api/projects/:id"], ["delete", "/api/projects/:id"],
])("%s %s requires authentication", async (method, path) => {
  expect((await request(app)[method](path.replace(":id", projectId))).status).toBe(401);
});
test("combines search, project, status and priority filters", async () => {
  const res = await api("get", "/api/tasks").query({ search: "SEARCHABLE", projectId, status: "PENDING", priority: "MEDIUM" });
  expect(res.status).toBe(200);
  expect(res.body.tasks.map((task) => task.id)).toEqual([taskId]);
  expect((await api("get", "/api/tasks", tokenB)).body.tasks).toEqual([]);
});
test("marks complete and returns scoped dashboard counts", async () => {
  expect((await api("put", `/api/tasks/${taskId}`).send({ status: "COMPLETED" })).status).toBe(200);
  const res = await api("get", "/api/dashboard");
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ totalProjects: 1, totalTasks: 1, completedTasks: 1, pendingTasks: 0, projectsInProgress: 1 });
  expect((await api("get", "/api/dashboard", tokenB)).body).toEqual({ totalProjects: 0, totalTasks: 0, completedTasks: 0, pendingTasks: 0, projectsInProgress: 0 });
});
test("task and nested project responses contain no password fields", async () => {
  for (const path of [`/api/tasks/${taskId}`, `/api/projects/${projectId}`]) {
    const res = await api("get", path);
    expect(res.status).toBe(200);
    expect(JSON.stringify(res.body)).not.toMatch(/passwordHash|password_hash/);
  }
});
test("deletes task and subsequent read returns 404", async () => {
  expect((await api("delete", `/api/tasks/${taskId}`)).status).toBe(204);
  expect((await api("get", `/api/tasks/${taskId}`)).status).toBe(404);
});
