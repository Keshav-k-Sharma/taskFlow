# TASK.md — TaskFlow Work Tracker

> Check this file before starting any work. If a task isn't listed, add it with a one-line description and today's date.
> Mark tasks `[x]` immediately after finishing and add the completion date.
> Architecture and decisions: `PLANNING.md`. Rules for agents: `AGENTS.md`.
> Format: `- [ ] ID — description (added YYYY-MM-DD)` → `- [x] ID — description (done YYYY-MM-DD)`
> Last updated: 2026-10-06

**Legend:** 🔴 core requirement · 🟡 important · 🟢 bonus

---

## ✅ Already in repo before this plan (reference only)
- [x] E1 — Express 5 backend with `controllers/routes/middleware/models` structure
- [x] E2 — bcrypt password hashing + JWT login/register (to be reworked, see Phase 2)
- [x] E3 — Next.js 16 App Router frontend: login, register, dashboard, projects, tasks, members pages
- [x] E4 — Web deployed on Vercel (`taskflow26.vercel.app`)
- [x] E5 — CORS allowlist and axios auth interceptor

---

## Phase 0 — Repo Setup & Housekeeping
- [x] 0.1 🔴 Add `PLANNING.md`, `TASK.md`, `AGENTS.md` to repo root (done 2026-10-06)
- [x] 0.2 🔴 Create a `dev` working branch; keep `main` deployable (done 2026-10-06)
- [x] 0.3 🟡 Add root `.gitignore` entries: `.env*`, `node_modules/`, `.next/`, `mobile/.expo/`, `*.apk`, `coverage/` (done 2026-10-06)
- [x] 0.4 🟡 Add ESLint + Prettier config for `backend/` (frontend already has ESLint) (done 2026-10-06)
- [x] 0.5 🔴 Add `.env.example` to `backend/`, `frontend/`, `mobile/` (README claims they exist; they don't) (done 2026-10-06)
- [x] 0.6 🟡 Add `docker-compose.yml` with Postgres (dev) and a second DB/schema for tests (done 2026-10-06)

---

## Phase 1 — Database Migration (MongoDB → PostgreSQL) 🔴
> Authorizes removal of Mongoose and Members code (see PLANNING §2.5).
- [x] 1.1 Provision Postgres (using Neon) and confirm `DATABASE_URL` works (done 2026-10-06)
- [x] 1.2 Install Prisma (`prisma`, `@prisma/client`); `prisma init` in `backend/` (done 2026-10-06)
- [x] 1.3 Write `schema.prisma`: `User`, `Project`, `Task`, `RevokedToken` + enums (`ProjectStatus`, `TaskStatus`, `Priority`) per PLANNING §6 (done 2026-10-06)
- [x] 1.4 Add FKs, `ON DELETE CASCADE`, indexes, unique email, `end_date >= start_date` check (raw SQL in migration) (done 2026-10-06)
- [x] 1.5 Run first migration; commit `prisma/migrations/` (done 2026-10-06)
- [x] 1.6 Create `src/db/prisma.js` singleton client (done 2026-10-06)
- [x] 1.7 Write `prisma/seed.js` with **test-only** users, projects and tasks (done 2026-10-06)
- [x] 1.8 Remove Mongoose dependency, `models/*.js`, `config/db.js` and the DNS hack (done 2026-10-06)
- [x] 1.9 Export ER diagram → `docs/ER_DIAGRAM.md` (Mermaid) + PNG (done 2026-10-06)

---

## Phase 2 — Backend Foundation & Auth 🔴
- [x] 2.1 Split `index.js` into `app.js` (export) and `server.js` (listen) (done 2026-10-06)
- [x] 2.2 `config/env.js`: load and validate env with Zod; fail fast if `JWT_SECRET`/`DATABASE_URL` missing or weak (done 2026-10-06)
- [x] 2.3 Logging: `pino` + `pino-http`, redact `authorization`/`password` (done 2026-10-06)
- [x] 2.4 Middleware: `helmet`, env-driven CORS allowlist, `express.json({limit})`, `trust proxy` (done 2026-10-06)
- [x] 2.5 `utils/AppError` + central `errorHandler` + `notFound` returning the standard error shape (done 2026-10-06)
- [x] 2.6 `middleware/validate.js` (Zod body/query/params) + `validators/auth.schema.js` (done 2026-10-06)
- [x] 2.7 `auth.service`: register (lowercase email, bcrypt cost 12, **ignore any `role`**), login (generic error), me (done 2026-10-06)
- [x] 2.8 `POST /api/auth/register` → 201 `{token,user}`; 409 on duplicate email (done 2026-10-06)
- [x] 2.9 `POST /api/auth/login` → `{token,user}`; 401 generic message (done 2026-10-06)
- [x] 2.10 JWT with `sub`, `jti`, env `JWT_EXPIRES_IN`; `authenticate` middleware (401 `UNAUTHENTICATED` / `TOKEN_EXPIRED`, never 500) (done 2026-10-06)
- [x] 2.11 `POST /api/auth/logout` → insert `jti` into `revoked_tokens`; middleware rejects revoked tokens (done 2026-10-06)
- [x] 2.12 `GET /api/auth/me` (done 2026-10-06)
- [x] 2.13 Rate limiting on login/register (+ light global limiter), return 429 `RATE_LIMITED` (done 2026-10-06)
- [x] 2.14 Scheduled cleanup of expired `revoked_tokens` (on boot + interval) (done 2026-10-06)
- [x] 2.15 `GET /api/health` kept (done 2026-10-06)

---

## Phase 3 — Projects & Tasks API 🔴
- [ ] 3.1 `validators/project.schema.js` (name required/non-empty, status enum, ISO dates, end ≥ start, strict keys) (added 2026-10-06)
- [ ] 3.2 `project.service` — all queries scoped by `ownerId` (added 2026-10-06)
- [ ] 3.3 `GET /api/projects` with `search` (name, case-insensitive) and `status` filters (added 2026-10-06)
- [ ] 3.4 `GET /api/projects/:id` (includes tasks); 404 if not owner (added 2026-10-06)
- [ ] 3.5 `POST /api/projects` (owner from token, never body) (added 2026-10-06)
- [ ] 3.6 `PUT /api/projects/:id` (added 2026-10-06)
- [ ] 3.7 `DELETE /api/projects/:id` (cascade) (added 2026-10-06)
- [ ] 3.8 `validators/task.schema.js` (name, priority, status, dueDate, `projectId` UUID) (added 2026-10-06)
- [ ] 3.9 `task.service` — scope via `project.ownerId`; verify `projectId` ownership on create/move (added 2026-10-06)
- [ ] 3.10 `GET /api/tasks` with `projectId`, `search`, `status`, `priority` filters (added 2026-10-06)
- [ ] 3.11 `GET /api/tasks/:id`, `POST /api/tasks`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id` (added 2026-10-06)
- [ ] 3.12 "Mark completed" works via `PUT` `{status:"COMPLETED"}` (document in API docs) (added 2026-10-06)
- [ ] 3.13 `GET /api/dashboard` using aggregate queries (`count`/`groupBy`), scoped to user (added 2026-10-06)
- [ ] 3.14 Remove `members` routes/controllers, `adminonly`, old `PATCH` routes (added 2026-10-06)
- [ ] 3.15 Serializers: whitelist response fields; confirm `passwordHash` can't leak (added 2026-10-06)

---

## Phase 4 — Backend Tests 🔴/🟡
- [ ] 4.1 Install Jest + Supertest; `npm test` script; test DB setup/teardown (added 2026-10-06)
- [ ] 4.2 Auth tests: register OK / duplicate email 409 / invalid email 400 / short password 400 (added 2026-10-06)
- [ ] 4.3 Auth tests: login OK / wrong password 401 / unknown email 401 (same message) (added 2026-10-06)
- [ ] 4.4 Auth tests: `/me` without token 401, expired token `TOKEN_EXPIRED`, revoked token after logout (added 2026-10-06)
- [ ] 4.5 Rate-limit test: N+1 login attempts → 429 (added 2026-10-06)
- [ ] 4.6 Project CRUD tests (expected, edge: empty name / bad dates, failure: bad UUID) (added 2026-10-06)
- [ ] 4.7 Task CRUD tests (expected, edge: no due date, failure: invalid enum) (added 2026-10-06)
- [ ] 4.8 **Authorization tests:** user B gets 404 on user A's project/task for GET/PUT/DELETE; B can't create task in A's project (added 2026-10-06)
- [ ] 4.9 Filter/search tests for projects and tasks (added 2026-10-06)
- [ ] 4.10 Dashboard test: counts correct and scoped per user (added 2026-10-06)
- [ ] 4.11 Response-shape test: no `passwordHash` in any response (added 2026-10-06)

---

## Phase 5 — Web Frontend (Next.js) 🔴
- [ ] 5.1 Create `.env.example`; reconcile `NEXT_PUBLIC_API_URL` usage with README (added 2026-10-06)
- [ ] 5.2 Build UI kit in `components/ui/`: Button, Input, Select, Modal, Spinner, Badge, EmptyState, Toast (Tailwind; replace inline styles) (added 2026-10-06)
- [ ] 5.3 `lib/api.js`: base URL, auth header, **401 interceptor** → clear storage → `/login?expired=1` (added 2026-10-06)
- [ ] 5.4 `AuthContext` / `useAuth` + route guard for protected pages (added 2026-10-06)
- [ ] 5.5 Login & Register: `react-hook-form` + Zod, inline errors, loading state, server error display, "session expired" banner (added 2026-10-06)
- [ ] 5.6 Logout: call `POST /auth/logout` then clear storage (added 2026-10-06)
- [ ] 5.7 Dashboard: 5 stat cards (Total Projects, Total Tasks, Completed, Pending, Projects In Progress) from `GET /dashboard` (added 2026-10-06)
- [ ] 5.8 Projects page: list as cards, search by name, status filter, create/edit modal, delete confirm (added 2026-10-06)
- [ ] 5.9 Project detail `/projects/[id]`: project info + task list (added 2026-10-06)
- [ ] 5.10 Task create/edit form (name, description, priority, status, due date), delete, **mark complete** toggle (added 2026-10-06)
- [ ] 5.11 Task search + status filter + priority filter (server-side query params, debounced search) (added 2026-10-06)
- [ ] 5.12 Tasks page (all tasks across projects) with the same filters (added 2026-10-06)
- [ ] 5.13 Loading skeletons, empty states, error banners on every data view (added 2026-10-06)
- [ ] 5.14 Responsive pass: navbar collapses to a menu on small screens; grids adapt (added 2026-10-06)
- [ ] 5.15 Remove Members page/components and nav link (added 2026-10-06)
- [ ] 5.16 Update navbar/branding for new nav: Dashboard · Projects · Tasks (added 2026-10-06)

---

## Phase 6 — Mobile App (Expo / React Native, Android) 🔴
- [ ] 6.1 `npx create-expo-app mobile`; set up `expo-router`, `.env.example` (`EXPO_PUBLIC_API_URL`) (added 2026-10-06)
- [ ] 6.2 Install `expo-secure-store`, `axios`, `@react-native-community/netinfo`, `react-hook-form`, `zod` (added 2026-10-06)
- [ ] 6.3 `src/storage/token.js`: get/set/clear token via **SecureStore only** (added 2026-10-06)
- [ ] 6.4 `src/api/client.js`: axios instance, bearer header, 401 `TOKEN_EXPIRED` handler → clear token → navigate to login with message (added 2026-10-06)
- [ ] 6.5 No-network handling: NetInfo banner + `ERR_NETWORK` mapping → "No internet connection" + Retry (added 2026-10-06)
- [ ] 6.6 Auth context + startup flow (token → `/auth/me` → route) (added 2026-10-06)
- [ ] 6.7 Screens: Login, Register (validation, loading, errors) (added 2026-10-06)
- [ ] 6.8 Dashboard screen with 5 stats + pull-to-refresh (added 2026-10-06)
- [ ] 6.9 Projects list screen (+ search/status filter optional) with pull-to-refresh (added 2026-10-06)
- [ ] 6.10 Project detail screen: tasks under the project (added 2026-10-06)
- [ ] 6.11 Task create/edit screen (name, description, priority, status, due date picker) (added 2026-10-06)
- [ ] 6.12 Delete task (confirm), mark completed, quick change of status and priority (added 2026-10-06)
- [ ] 6.13 Task search + filter by status and priority (added 2026-10-06)
- [ ] 6.14 Logout (server call + clear SecureStore) (added 2026-10-06)
- [ ] 6.15 Phone UX polish: safe areas, keyboard avoidance, touch target sizes, empty/loading states (added 2026-10-06)
- [ ] 6.16 Test on Android emulator (`10.0.2.2`) **and** a physical device against the deployed backend (added 2026-10-06)
- [ ] 6.17 Configure `eas.json` `preview` profile → build `.apk` (added 2026-10-06)
- [ ] 6.18 Upload APK / publish Expo link; add to README (added 2026-10-06)

---

## Phase 7 — Deployment 🔴
- [ ] 7.1 Create a **Neon** project and database; copy the connection string into `DATABASE_URL`; run `prisma migrate deploy` (added 2026-10-06)
- [ ] 7.2 Deploy backend (Render/Railway/Vercel); set env vars (`DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS`, …) (added 2026-10-06)
- [ ] 7.3 Point existing Vercel web project at the new backend URL (`NEXT_PUBLIC_API_URL`) (added 2026-10-06)
- [ ] 7.4 Add deployed web origin to `CORS_ORIGINS`; verify preflight (added 2026-10-06)
- [ ] 7.5 Smoke test the deployed stack end-to-end (register on web → login on mobile) (added 2026-10-06)
- [ ] 7.6 Create seeded demo account (**test data only**) for reviewers (added 2026-10-06)

---

## Phase 8 — Documentation 🔴
- [ ] 8.1 Rewrite `README.md` accurately (remove false claims: TypeScript, `/api/users/*`, `tailwind.config.js`, etc.) (added 2026-10-06)
- [ ] 8.2 README: setup for backend, web, mobile (step by step, copy-pasteable) (added 2026-10-06)
- [ ] 8.3 README: environment variable tables per app (added 2026-10-06)
- [ ] 8.4 README: database setup (Docker, migrate, seed) (added 2026-10-06)
- [ ] 8.5 README: **how to run the mobile app against the deployed backend** (added 2026-10-06)
- [ ] 8.6 `docs/openapi.yaml` + Swagger UI at `/api/docs` (added 2026-10-06)
- [ ] 8.7 `docs/API.md` with request/response examples and error codes (added 2026-10-06)
- [ ] 8.8 ER diagram committed (`docs/ER_DIAGRAM.md` + PNG) (added 2026-10-06)
- [ ] 8.9 Add architecture diagram + screenshots (web + mobile) to README (added 2026-10-06)
- [ ] 8.10 Prepare short "design decisions" notes for the review session (why Postgres/Prisma, 404 vs 403, JWT revocation, ownership via project join, rate limiting) (added 2026-10-06)

---

## Phase 9 — QA & Submission 🔴
- [ ] 9.1 Manual security checklist: other user's IDs → 404 on web **and** mobile; no token → 401; password never in responses; SQLi strings in search; oversized/invalid payloads (added 2026-10-06)
- [ ] 9.2 Manual UX checklist: validation errors, loading, empty states, expired-session message, airplane-mode message (added 2026-10-06)
- [ ] 9.3 Cross-platform sync check: change on one platform appears on the other after refresh / pull-to-refresh (added 2026-10-06)
- [ ] 9.4 Repo is public and viewable without login; no secrets committed (scan history) (added 2026-10-06)
- [ ] 9.5 Record the **5-minute demo**: same account on web + mobile → create task on one → show on the other (+ brief security/expiry/offline demo if time) (added 2026-10-06)
- [ ] 9.6 Assemble submission: repo link, ER diagram, API docs, README, deployment URLs, APK/Expo link, recording (added 2026-10-06)

---

## Bonus 🟢 (in suggested order)
- [ ] B1 — Docker Compose for backend + Postgres, backend `Dockerfile` *(Assigned to User to learn and do manually)* (added 2026-10-06)
- [ ] B2 — Integration tests complete (covered by Phase 4) + unit tests for services/utils (added 2026-10-06)
- [ ] B3 — Pagination + sorting on `/projects` and `/tasks` (`page`, `limit`, `sort`, `order`) (added 2026-10-06)
- [ ] B4 — GitHub Actions CI: lint + test with Postgres service (added 2026-10-06)
- [ ] B5 — Refresh tokens (rotation, store hashed, httpOnly cookie on web / SecureStore on mobile) (added 2026-10-06)
- [ ] B6 — Shared Zod schemas package used by backend, web and mobile (added 2026-10-06)
- [ ] B7 — Offline viewing on mobile (cache last lists in AsyncStorage, show "offline" badge) (added 2026-10-06)
- [ ] B8 — Push notifications for tasks due tomorrow (`expo-notifications` + scheduled job) (added 2026-10-06)
- [ ] B9 — Audit logs table + middleware (added 2026-10-06)
- [ ] B10 — RBAC (re-introduce roles properly) (added 2026-10-06)

---

## 🔍 Discovered During Work
> Add new sub-tasks, bugs and TODOs here as they appear, with a date.

- [ ] D1 — `authMiddleware` returns 500 on JWT verification failure; must be 401 (covered by 2.10) (added 2026-10-06)
- [ ] D2 — `register` accepts `role` from request body → privilege escalation (covered by 2.7) (added 2026-10-06)
- [ ] D3 — `GET /projects` and `GET /tasks` return all users' data → authorization hole (covered by 3.2, 3.9) (added 2026-10-06)
- [ ] D4 — README documents `NEXT_PUBLIC_API_BASE_URL`, code uses `NEXT_PUBLIC_API_URL` (covered by 5.1, 8.1) (added 2026-10-06)

---

## ✔️ Completed Log
> Move finished items here with the completion date if this file gets long.

_(empty)_
