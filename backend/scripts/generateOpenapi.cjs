const fs = require("node:fs");
const path = require("node:path");
const YAML = require("yaml");

/**
 * Returns a reference to a reusable response schema.
 * @param {string} name - Schema name.
 * @returns {object} OpenAPI reference.
 */
function ref(name) {
  return { $ref: `#/components/schemas/${name}` };
}

/**
 * Describes a JSON response.
 * @param {string} description - Response meaning.
 * @param {object} schema - Response schema.
 * @returns {object} OpenAPI response.
 */
function response(description, schema) {
  return { description, content: { "application/json": { schema } } };
}

/**
 * Wraps the API's named object or array response.
 * @param {string} key - Wrapper property.
 * @param {object} schema - Wrapped value schema.
 * @returns {object} Object schema.
 */
function wrapper(key, schema) {
  return { type: "object", required: [key], properties: { [key]: schema } };
}

/**
 * Describes an optional query parameter.
 * @param {string} name - Query key.
 * @param {object} schema - Parameter schema.
 * @returns {object} OpenAPI parameter.
 */
function query(name, schema) {
  return { name, in: "query", required: false, schema };
}

/**
 * Describes a required JSON body.
 * @param {object} schema - Request schema.
 * @returns {object} OpenAPI request body.
 */
function body(schema) {
  return { required: true, content: { "application/json": { schema } } };
}

/**
 * Builds a documented operation with standard error responses.
 * @param {string} tag - Resource group.
 * @param {string} summary - Operation purpose.
 * @param {object} success - Success and resource-specific responses.
 * @param {object} options - Operation overrides.
 * @returns {object} OpenAPI operation.
 */
function operation(tag, summary, success, options = {}) {
  return {
    tags: [tag],
    summary,
    responses: {
      ...success,
      400: response("Invalid input", ref("Error")),
      401: response("Missing, expired, invalid or revoked token", ref("Error")),
      429: response("Request rate limit exceeded", ref("Error")),
      500: response("Unexpected server error", ref("Error")),
    },
    ...options,
  };
}

const uuid = { type: "string", format: "uuid" };
const timestamp = { type: "string", format: "date-time" };
const nullableText = { type: "string", nullable: true };
const inputDate = {
  type: "string",
  nullable: true,
  pattern: "^\\d{4}-\\d{2}-\\d{2}$",
  example: "2026-10-08",
};
const outputDate = {
  ...timestamp,
  nullable: true,
  example: "2026-10-08T00:00:00.000Z",
};
const projectStatus = {
  type: "string",
  enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"],
};
const taskStatus = {
  type: "string",
  enum: ["PENDING", "IN_PROGRESS", "COMPLETED"],
};
const priority = { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] };
const name = { type: "string", minLength: 1, maxLength: 150 };
const idParameter = { name: "id", in: "path", required: true, schema: uuid };
const notFound = {
  404: response(
    "Missing resource or resource owned by another user",
    ref("Error")
  ),
};
const projectInput = {
  name,
  description: nullableText,
  status: projectStatus,
  startDate: inputDate,
  endDate: inputDate,
};
const taskInput = {
  name,
  description: nullableText,
  priority,
  status: taskStatus,
  dueDate: inputDate,
};
const projectOutput = {
  id: uuid,
  ...projectInput,
  startDate: outputDate,
  endDate: outputDate,
  createdAt: timestamp,
  updatedAt: timestamp,
};
const taskOutput = {
  id: uuid,
  projectId: uuid,
  ...taskInput,
  dueDate: outputDate,
  createdAt: timestamp,
  updatedAt: timestamp,
};
const schemas = {
  User: {
    type: "object",
    required: ["id", "fullName", "email", "createdAt"],
    properties: {
      id: uuid,
      fullName: { type: "string" },
      email: { type: "string", format: "email" },
      createdAt: timestamp,
    },
  },
  AuthResult: {
    type: "object",
    required: ["token", "user"],
    properties: {
      token: {
        type: "string",
        description: "JWT access token. Never log or commit it.",
      },
      user: ref("User"),
    },
  },
  Register: {
    type: "object",
    required: ["fullName", "email", "password"],
    properties: {
      fullName: { type: "string", minLength: 1, maxLength: 100 },
      email: { type: "string", format: "email" },
      password: {
        type: "string",
        minLength: 8,
        format: "password",
        writeOnly: true,
      },
    },
  },
  Login: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: {
        type: "string",
        minLength: 1,
        format: "password",
        writeOnly: true,
      },
    },
  },
  Project: {
    type: "object",
    required: Object.keys(projectOutput),
    properties: projectOutput,
  },
  ProjectDetail: {
    allOf: [
      ref("Project"),
      {
        type: "object",
        required: ["tasks"],
        properties: { tasks: { type: "array", items: ref("TaskBrief") } },
      },
    ],
  },
  ProjectCreate: {
    type: "object",
    required: ["name"],
    properties: {
      ...projectInput,
      status: { ...projectStatus, default: "NOT_STARTED" },
    },
  },
  ProjectUpdate: { type: "object", properties: projectInput },
  Task: {
    type: "object",
    required: Object.keys(taskOutput),
    properties: taskOutput,
  },
  TaskBrief: {
    type: "object",
    required: ["id", "name", "priority", "status", "dueDate", "createdAt"],
    properties: {
      id: uuid,
      name,
      priority,
      status: taskStatus,
      dueDate: outputDate,
      createdAt: timestamp,
    },
  },
  TaskCreate: {
    type: "object",
    required: ["projectId", "name"],
    properties: {
      projectId: uuid,
      ...taskInput,
      priority: { ...priority, default: "MEDIUM" },
      status: { ...taskStatus, default: "PENDING" },
    },
  },
  TaskUpdate: { type: "object", properties: taskInput },
  Dashboard: {
    type: "object",
    required: [
      "totalProjects",
      "totalTasks",
      "completedTasks",
      "pendingTasks",
      "projectsInProgress",
    ],
    properties: Object.fromEntries(
      [
        "totalProjects",
        "totalTasks",
        "completedTasks",
        "pendingTasks",
        "projectsInProgress",
      ].map((key) => [key, { type: "integer", minimum: 0 }])
    ),
  },
  Error: {
    type: "object",
    required: ["error"],
    properties: {
      error: {
        type: "object",
        required: ["code", "message"],
        properties: {
          code: {
            type: "string",
            enum: [
              "VALIDATION_ERROR",
              "UNAUTHENTICATED",
              "TOKEN_EXPIRED",
              "INVALID_CREDENTIALS",
              "NOT_FOUND",
              "EMAIL_TAKEN",
              "RATE_LIMITED",
              "INTERNAL",
            ],
          },
          message: { type: "string" },
          details: {
            type: "array",
            items: {
              type: "object",
              required: ["field", "message"],
              properties: {
                field: { type: "string" },
                message: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
};
const paths = {
  "/health": {
    get: {
      tags: ["System"],
      summary: "Process liveness (does not check the database)",
      security: [],
      responses: {
        200: response("API process is running", {
          type: "object",
          required: ["status"],
          properties: { status: { type: "string", enum: ["UP"] } },
        }),
        429: response("Rate limited", ref("Error")),
      },
    },
  },
  "/auth/register": {
    post: operation(
      "Auth",
      "Register a user",
      {
        201: response("Registered", ref("AuthResult")),
        409: response("Email already registered", ref("Error")),
      },
      { security: [], requestBody: body(ref("Register")) }
    ),
  },
  "/auth/login": {
    post: operation(
      "Auth",
      "Log in (generic failure message)",
      { 200: response("Authenticated", ref("AuthResult")) },
      { security: [], requestBody: body(ref("Login")) }
    ),
  },
  "/auth/me": {
    get: operation("Auth", "Get the authenticated user", {
      200: response("Current user", wrapper("user", ref("User"))),
    }),
  },
  "/auth/logout": {
    post: operation("Auth", "Revoke the current token", {
      204: { description: "Logged out; empty response body" },
    }),
  },
  "/dashboard": {
    get: operation(
      "Dashboard",
      "Get owner-scoped counts; pending means PENDING only",
      { 200: response("Five dashboard counts", ref("Dashboard")) }
    ),
  },
};

// Reason: Both clients use the same CRUD contract; generate parallel paths consistently.
for (const resource of ["projects", "tasks"]) {
  const isProject = resource === "projects";
  const model = isProject ? "Project" : "Task";
  const key = isProject ? "project" : "task";
  const filters = [
    query("search", {
      type: "string",
      description: "Case-insensitive name substring",
    }),
    query("status", isProject ? projectStatus : taskStatus),
  ];
  if (!isProject)
    filters.push(query("projectId", uuid), query("priority", priority));
  paths[`/${resource}`] = {
    get: operation(
      model,
      `List own ${resource}, newest first (no pagination)`,
      {
        200: response(
          "Matching resources",
          wrapper(resource, { type: "array", items: ref(model) })
        ),
      },
      { parameters: filters }
    ),
    post: operation(
      model,
      `Create ${key}`,
      {
        201: response("Created", wrapper(key, ref(model))),
        ...(!isProject && notFound),
      },
      { requestBody: body(ref(`${model}Create`)) }
    ),
  };
  paths[`/${resource}/{id}`] = {
    parameters: [idParameter],
    get: operation(
      model,
      `Get own ${key}${isProject ? " with brief tasks" : ""}`,
      {
        200: response(
          "Resource",
          wrapper(key, ref(isProject ? "ProjectDetail" : "Task"))
        ),
        ...notFound,
      }
    ),
    put: operation(
      model,
      `Update supplied ${key} fields`,
      { 200: response("Updated", wrapper(key, ref(model))), ...notFound },
      { requestBody: body(ref(`${model}Update`)) }
    ),
    delete: operation(
      model,
      `Delete own ${key}${isProject ? " and cascade its tasks" : ""}`,
      { 204: { description: "Deleted; empty response body" }, ...notFound }
    ),
  };
}

const specification = {
  openapi: "3.0.3",
  info: {
    title: "TaskFlow API",
    version: "1.0.0",
    description:
      "Shared web and Android REST API. Owner IDs come from authentication. Input dates use YYYY-MM-DD; response dates are UTC date-time strings. Unknown input fields are currently stripped, never assigned; strict/calendar-date validation is tracked as D8.",
  },
  servers: [
    { url: "/api", description: "Same API host" },
    { url: "http://localhost:5000/api", description: "Local development" },
    {
      url: "https://taskflow-1sh2.onrender.com/api",
      description: "Render deployment",
    },
  ],
  security: [{ bearerAuth: [] }],
  tags: ["Auth", "Project", "Task", "Dashboard", "System"].map((tag) => ({
    name: tag,
  })),
  paths,
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas,
  },
};
fs.writeFileSync(
  path.resolve(__dirname, "../../docs/openapi.yaml"),
  YAML.stringify(specification, {
    aliasDuplicateObjects: false,
    lineWidth: 100,
  })
);
console.log("Generated docs/openapi.yaml from the documented API contract.");
