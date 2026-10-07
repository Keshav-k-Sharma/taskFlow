# TaskFlow API

Base URL: `http://localhost:5000/api` locally or
`https://taskflow-1sh2.onrender.com/api` on Render. Web and Android use identical
endpoints and payloads. JSON request bodies require `Content-Type: application/json`.

The machine-readable contract is [openapi.yaml](openapi.yaml). Swagger UI is
served at `/api/docs/`; `/api/docs/openapi.yaml` returns the contract. These public
documentation routes do not expose accounts or require a token. They must be
deployed from the Phase 8 branch before they are available on Render.

## Authentication and shared behavior

Protected endpoints require `Authorization: Bearer <access-token>`. Register and
login return `{token,user}`. A user has `id`, `fullName`, `email`, `createdAt`;
passwords and password hashes are never returned. Logout revokes only the token
used for that request. A revoked/invalid/missing token returns 401; an expired
token returns 401 `TOKEN_EXPIRED`.

Projects belong to the authenticated user. Task ownership comes from their
project. Missing or foreign resources both return 404. Do not submit `ownerId`,
`id`, `createdAt`, `role`, or `passwordHash`. Strict validators reject unknown
body, query and parameter fields; services whitelist writable fields as well.

Names are trimmed and limited to 150 characters; fullName is limited to 100.
Emails are trimmed/lowercased. Registration passwords need at least 8 characters.
Enum strings are case-sensitive. Date inputs use `YYYY-MM-DD` or null; response
dates serialize as UTC date-time strings such as `2026-10-08T00:00:00.000Z`.
Input validation rejects impossible calendar dates (including non-leap February 29).
Create/update checks endDate >= startDate when both are supplied.

Lists return all matches, newest first. Search is a case-insensitive substring of
the name. Pagination and sorting parameters are not implemented. No matches
returns an empty array, including tasks filtered to an unavailable project.

The global limit is 200 requests/minute/IP. Login and registration share an
additional configurable limit, default 5 requests/15 minutes/IP. A 429 uses
`RATE_LIMITED`; observe Retry-After and rate-limit headers before retrying.
JSON request bodies are limited to 10 KB. Malformed JSON returns 400
VALIDATION_ERROR; oversized bodies return 413 PAYLOAD_TOO_LARGE. A disallowed
browser origin returns 403 CORS_NOT_ALLOWED (ownership failures still return 404).

## Endpoints

All paths below are relative to `/api`.

| Method | Path             | Auth | Successful response                         |
| ------ | ---------------- | ---- | ------------------------------------------- |
| GET    | `/health`        | No   | 200 `{status:"UP"}` (process liveness only) |
| POST   | `/auth/register` | No   | 201 `{token,user}`                          |
| POST   | `/auth/login`    | No   | 200 `{token,user}`                          |
| GET    | `/auth/me`       | Yes  | 200 `{user}`                                |
| POST   | `/auth/logout`   | Yes  | 204, empty body                             |
| GET    | `/projects`      | Yes  | 200 `{projects:[...]}`                      |
| POST   | `/projects`      | Yes  | 201 `{project}`                             |
| GET    | `/projects/:id`  | Yes  | 200 `{project}` with brief tasks            |
| PUT    | `/projects/:id`  | Yes  | 200 `{project}`                             |
| DELETE | `/projects/:id`  | Yes  | 204; cascades tasks                         |
| GET    | `/tasks`         | Yes  | 200 `{tasks:[...]}`                         |
| POST   | `/tasks`         | Yes  | 201 `{task}`                                |
| GET    | `/tasks/:id`     | Yes  | 200 `{task}`                                |
| PUT    | `/tasks/:id`     | Yes  | 200 `{task}`                                |
| DELETE | `/tasks/:id`     | Yes  | 204                                         |
| GET    | `/dashboard`     | Yes  | 200, five counts                            |

`:id` and task projectId must be UUIDs. Invalid IDs return 400 once authenticated;
requests without authentication return 401 before resource validation.

## Register and login

Registration request:

```json
{
  "fullName": "Example Reviewer",
  "email": "reviewer@example.com",
  "password": "example-password-only"
}
```

Login request:

```json
{ "email": "reviewer@example.com", "password": "example-password-only" }
```

Success (token deliberately redacted):

```json
{
  "token": "<access-token>",
  "user": {
    "id": "e90e7110-8034-4efe-8c90-0cb7d9faf5bb",
    "fullName": "Example Reviewer",
    "email": "reviewer@example.com",
    "createdAt": "2026-10-08T00:00:00.000Z"
  }
}
```

Duplicate registration returns 409 `EMAIL_TAKEN`. Login failures use 401
`INVALID_CREDENTIALS`, always with "Invalid email or password". GET /auth/me returns
the same user under `{user}`. POST /auth/logout has no request body and returns no JSON.

## Projects

GET /projects supports `search` and `status`. Status values: `NOT_STARTED`,
`IN_PROGRESS`, `COMPLETED`.

POST /projects accepts required `name`; optional `description`, `status`
(default NOT_STARTED), `startDate`, `endDate`. Optional text/dates may be null.
PUT /projects/:id accepts those fields optionally. Omitted fields stay unchanged;
null clears nullable fields. An empty update is currently accepted.

Request example:

```json
{
  "name": "Demo Project",
  "description": "Fictional review data",
  "status": "IN_PROGRESS",
  "startDate": "2026-10-08",
  "endDate": "2026-10-20"
}
```

Response example:

```json
{
  "project": {
    "id": "eb6c9980-40b9-48a6-baa7-d93d1a975513",
    "name": "Demo Project",
    "description": "Fictional review data",
    "status": "IN_PROGRESS",
    "startDate": "2026-10-08T00:00:00.000Z",
    "endDate": "2026-10-20T00:00:00.000Z",
    "createdAt": "2026-10-08T00:00:00.000Z",
    "updatedAt": "2026-10-08T00:00:00.000Z"
  }
}
```

GET /projects/:id additionally includes `project.tasks`, newest first. Each brief
task contains only id, name, priority, status, dueDate, createdAt. Use GET /tasks/:id
for description, projectId and updatedAt. Create/update/list responses do not
include embedded tasks.

## Tasks

GET /tasks supports `search`, `projectId`, `status`, `priority` together.
Statuses: `PENDING`, `IN_PROGRESS`, `COMPLETED`. Priorities: `LOW`, `MEDIUM`, `HIGH`.

POST /tasks requires `projectId` and `name`; optional description, priority
(default MEDIUM), status (default PENDING), dueDate. The project must be owned.
PUT /tasks/:id accepts name, description, priority, status, dueDate optionally;
it cannot move a task to another project. Nullable fields can be cleared with null.
Mark complete with `{"status":"COMPLETED"}` using PUT, not a retired PATCH route.

Request example:

```json
{
  "projectId": "eb6c9980-40b9-48a6-baa7-d93d1a975513",
  "name": "Try task editing",
  "priority": "HIGH",
  "status": "PENDING",
  "dueDate": "2026-10-12"
}
```

Response example:

```json
{
  "task": {
    "id": "4a5d54e0-7235-4c12-bfc8-43bc0097bf52",
    "projectId": "eb6c9980-40b9-48a6-baa7-d93d1a975513",
    "name": "Try task editing",
    "description": null,
    "priority": "HIGH",
    "status": "PENDING",
    "dueDate": "2026-10-12T00:00:00.000Z",
    "createdAt": "2026-10-08T00:00:00.000Z",
    "updatedAt": "2026-10-08T00:00:00.000Z"
  }
}
```

## Dashboard

```json
{
  "totalProjects": 1,
  "totalTasks": 2,
  "completedTasks": 1,
  "pendingTasks": 1,
  "projectsInProgress": 1
}
```

All counts are scoped to the user. pendingTasks counts PENDING only; tasks with
IN_PROGRESS count in totalTasks but not pendingTasks. projectsInProgress counts
IN_PROGRESS projects.

## Errors

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [{ "field": "email", "message": "Invalid email address" }]
  }
}
```

Details is optional and contains field/message pairs. Operational errors omit
stack traces; production unexpected errors use a generic message.

| HTTP | Code                | Meaning                                            |
| ---- | ------------------- | -------------------------------------------------- |
| 400  | VALIDATION_ERROR    | Invalid body/query/UUID                            |
| 401  | UNAUTHENTICATED     | Missing, invalid, revoked token or missing account |
| 401  | TOKEN_EXPIRED       | Expired JWT                                        |
| 401  | INVALID_CREDENTIALS | Generic login failure                              |
| 404  | NOT_FOUND           | Missing/foreign resource or unknown API route      |
| 409  | EMAIL_TAKEN         | Duplicate email                                    |
| 429  | RATE_LIMITED        | Per-IP request limit                               |
| 500  | INTERNAL            | Unexpected server failure                          |
| 413  | PAYLOAD_TOO_LARGE   | JSON body exceeds 10 KB                            |
| 403  | CORS_NOT_ALLOWED    | Browser origin is absent from the allowlist        |

Clients clear protected sessions on 401. Login/register form failures do not
clear an unrelated session. Mobile offline messages are client-side network
handling, not a special backend error code.

## Updating this contract

Update backend/scripts/generateOpenapi.cjs to match routes, validators and
serializers, run `node backend/scripts/generateOpenapi.cjs`, then update this file
and verify both clients. Never document planned fields/endpoints as implemented.
