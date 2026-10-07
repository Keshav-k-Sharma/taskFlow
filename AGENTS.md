# AGENTS.md — Rules for AI Coding Agents on TaskFlow

> Adapted from the reference template to this project's stack:
> **Node.js + Express 5 + Prisma + PostgreSQL**, **Next.js (App Router)**, **Expo / React Native**.
> (The reference's Python/FastAPI/Pytest rules are translated to their JavaScript equivalents.)

### 🔄 Project Awareness & Context
- **Always read `PLANNING.md`** at the start of a new conversation to understand the architecture, goals, API contract, data model, style and constraints.
- **Check `TASK.md`** before starting a new task. If the task isn't listed, add it with a brief description and today's date.
- **Use consistent naming conventions, file structure and architecture patterns** as described in `PLANNING.md` (§5 layout, §14 naming).
- If a request conflicts with `PLANNING.md`, say so and ask before deviating. Update `PLANNING.md` when a decision changes.
- The task PDF requirements are the acceptance criteria. Don't add features that contradict them (e.g. no MongoDB, no separate mobile backend).

### 🧱 Code Structure & Modularity
- **Never create a file longer than 500 lines of code.** If a file approaches this limit, refactor by splitting it into modules or helper files.
- **Organize code into clearly separated modules**, grouped by feature or responsibility.
- **Backend layering:** `routes → controllers → services → db (Prisma)`.
  - Routes: wiring only (path, middleware, controller).
  - Controllers: thin. Parse the request, call a service, send the response.
  - Services: business logic and **all** database access.
  - Validators: Zod schemas, one file per resource.
- **Frontend / mobile:** keep pages/screens thin. Put reusable UI in `components/`, data fetching in `hooks/` or `lib/api`, and no API calls inline in JSX.
- **Use clear, consistent imports** (prefer relative imports within a package; use the `@/` alias only in `/frontend`).
- Module systems: `/backend` uses **CommonJS** (`require`/`module.exports`). `/frontend` and `/mobile` use **ES modules**. Don't mix within a package.
- Don't introduce a new dependency if the existing stack already solves the problem.

### 🔐 Security Rules (non-negotiable, this is graded)
- **Every query that touches projects or tasks must be scoped to the authenticated user** (`ownerId` from `req.user`, never from the request body/params). Tasks are scoped through `project.ownerId`.
- Return **404** (not 403) when a resource isn't found *or* isn't owned by the user.
- **Never accept** `id`, `ownerId`, `createdAt`, `role` or `passwordHash` from client input. Use strict Zod schemas / explicit field whitelists.
- **Validate every request** (body, query, params) with Zod in middleware before it reaches a controller.
- **Never build SQL from user input.** Use Prisma query methods. Do not use `$queryRawUnsafe` / string-concatenated SQL.
- **Never return or log** `passwordHash`, JWTs, `Authorization` headers or secrets. Use serializers/whitelists for responses.
- Passwords: bcrypt (cost ≥ 12). Auth errors for login must be generic ("Invalid email or password").
- JWT problems map to **401** (`UNAUTHENTICATED` / `TOKEN_EXPIRED`), never 500.
- Auth endpoints keep their **rate limiter**. Don't remove or loosen it without a `TASK.md` entry.
- Mobile tokens go in **`expo-secure-store` only**. Never `AsyncStorage` or plain storage.
- Secrets live in `.env` (git-ignored). Add every new variable to the matching `.env.example` **and** the README env table.

### 🧪 Testing & Reliability
- **Always create Jest unit/integration tests for new backend features** (services, middleware, routes). Use **Supertest** for route tests.
- **After updating any logic**, check whether existing tests need to be updated. If so, do it.
- **Tests live in `backend/tests/`**, mirroring the `backend/src/` structure (e.g. `src/services/task.service.js` → `tests/services/task.service.test.js`).
- Include at least, for each new feature:
  - 1 test for expected use
  - 1 edge case
  - 1 failure case
- **Every new endpoint needs an authorization test**: another user's resource returns 404 and no token returns 401.
- Tests use a **separate test database**. Never run tests against dev or production data.
- Frontend/mobile: add component or hook tests when a component contains logic; otherwise add the manual check to `TASK.md` Phase 9.
- Run `npm test` and `npm run lint` before declaring a task done.

### ✅ Task Completion
- **Mark completed tasks in `TASK.md`** immediately after finishing them (`[x]` + completion date).
- Add new sub-tasks or TODOs discovered during development to `TASK.md` under the **"Discovered During Work"** section.
- Keep commits small and use Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `chore:`).

### 📎 Style & Conventions
- **Use JavaScript** (Node 20+ LTS) as the primary language across backend, web and mobile, with **JSDoc** types. Don't introduce TypeScript unless `PLANNING.md` is updated first.
- Format with **Prettier** and lint with **ESLint**. Fix lint errors, don't disable rules to silence them.
- **Use `zod` for data validation** (backend request validation, env validation, and client form validation).
- Use **Express 5** for the API and **Prisma** as the ORM (PostgreSQL). Express 5 forwards async errors to the error handler, so don't wrap handlers in `try/catch` just to return 500. Throw `AppError` instead.
- Styling on web: **Tailwind CSS**. Do not add new inline-style blocks.
- Naming: `camelCase` variables/functions, `PascalCase` components, `UPPER_SNAKE` enums and constants, `snake_case` DB columns (via Prisma `@map`).
- Error responses must use the standard shape in `PLANNING.md` §7.
- Write a **JSDoc block for every function** (Google-style wording):
  ```js
  /**
   * Brief summary.
   *
   * @param {string} param1 - Description.
   * @returns {Promise<Type>} Description.
   * @throws {AppError} When/why it throws.
   */
  async function example(param1) {}
  ```

### 📚 Documentation & Explainability
- **Update `README.md`** when new features are added, dependencies change, or setup steps are modified.
- Update `docs/openapi.yaml` / `docs/API.md` whenever an endpoint, field or error code changes. Update `docs/ER_DIAGRAM.md` when the schema changes.
- **Comment non-obvious code** and ensure everything is understandable to a mid-level developer.
- When writing complex logic, **add an inline `// Reason:` comment** explaining the why, not just the what.
- The author must be able to **explain every decision in a review**. Prefer simple, readable solutions over clever ones.

### 🗄️ Database Rules
- All schema changes go through **Prisma migrations** (`prisma migrate dev`). Never edit the DB by hand or edit applied migration files.
- Keep the schema normalized. Don't duplicate data (e.g. no `ownerId` on tasks).
- New query patterns on large filters need an index. Note it in the migration.
- Seed data is **test data only**. No real personal data anywhere.

### 📱 Cross-Platform Consistency
- Web and mobile must use **the same endpoints and payloads**. Never add a mobile-only or web-only endpoint without a `PLANNING.md` decision.
- Enum values and labels must match across backend, web and mobile (`IN_PROGRESS` → "In Progress"). Change them in one place first (backend schema) and then update both clients.
- Any API change must be checked against **both** clients before it's marked done.

### 🧠 AI Behavior Rules
- **Never assume missing context. Ask questions if uncertain.**
- **Never hallucinate libraries or functions.** Only use known, verified packages and APIs. If unsure a package or option exists, check its docs or `package.json` first.
- **Always confirm file paths and module names exist** before referencing them in code or tests.
- **Never delete or overwrite existing code** unless explicitly instructed to or if it's part of a task from `TASK.md`. The Mongo→Postgres migration tasks in `TASK.md` (Phase 1 and 3.14, 5.15) explicitly authorize removing Mongoose, `models/`, Members and `adminonly` code.
- Don't commit secrets, `.env` files, build artifacts or APKs.
- Prefer small, reviewable changes. Summarize what changed, which files, and what to test.
