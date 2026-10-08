# TASK.md — TaskFlow Work Tracker

> Check this file before starting any work. If a task isn't listed, add it with a one-line description and today's date.
> Mark tasks `[x]` immediately after finishing and add the completion date.
> Architecture and decisions: `PLANNING.md`. Rules for agents: `AGENTS.md`.
> Format: `- [ ] ID — description (added YYYY-MM-DD)` → `- [x] ID — description (done YYYY-MM-DD)`
> Last updated: 2026-10-08

Current expressive design checkpoint (2026-10-08): both clients now use vivid blue accents, a bold dashboard hero, tinted summary cards and warm light surfaces. Mobile version 1.0.4/versionCode 5 prepared; physical-phone acceptance remains pending.

**Legend:** 🔴 core requirement · 🟡 important · 🟢 bonus

Current palette correction (2026-10-08): professional stone/ivory/navy/teal replaces the peach theme on both clients. Deployed website color and reduced-motion behavior verified at b7b4f64. 68 client tests, lint, web build and Android export pass. Mobile version 1.0.3/versionCode 4 submitted: https://expo.dev/accounts/keshavkss-team/projects/taskflow/builds/7dde7951-5887-4011-9e98-46a2e6f870c7. Use this latest build rather than superseded design builds. Phone verification remains pending.

Latest design/release checkpoint (2026-10-08): warm light website and mobile design replaces the earlier dark theme. Commit 29596f5 is deployed; actual Vercel canvas and reduced-motion behavior verified. Current client verification: web 30 tests, mobile 38 tests, lint, production web build and Android export pass. Warm-theme APK version 1.0.2/versionCode 3 submitted at https://expo.dev/accounts/keshavkss-team/projects/taskflow/builds/0cbeb6a0-0194-414e-81a7-d738fd6ebcc2; use it instead of older design builds. Phone/emulator/sync/screenshot/recording checks remain pending.

Current phase completion audit (2026-10-08): Phases 0–5 are complete, including full test-database verification and deployed web acceptance. Phase 6 implementation/distribution setup is complete; updated APK is building and full phone/emulator acceptance (6.16) remains open. Phase 7 hosting is verified; web registration followed by login on the physical Android app (7.5) remains open. Phase 8 docs/diagrams/web screenshots are complete; native Android screenshots (8.9) remain open. These device-dependent items must be verified before marking Phases 6–8 fully complete. Docker remains last.

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
- [x] 3.1 `validators/project.schema.js` (name required/non-empty, status enum, ISO dates, end ≥ start, strict keys) (done 2026-10-06)
- [x] 3.2 `project.service` — all queries scoped by `ownerId` (done 2026-10-06)
- [x] 3.3 `GET /api/projects` with `search` (name, case-insensitive) and `status` filters (done 2026-10-06)
- [x] 3.4 `GET /api/projects/:id` (includes tasks); 404 if not owner (done 2026-10-06)
- [x] 3.5 `POST /api/projects` (owner from token, never body) (done 2026-10-06)
- [x] 3.6 `PUT /api/projects/:id` (done 2026-10-06)
- [x] 3.7 `DELETE /api/projects/:id` (cascade) (done 2026-10-06)
- [x] 3.8 `validators/task.schema.js` (name, priority, status, dueDate, `projectId` UUID) (done 2026-10-06)
- [x] 3.9 `task.service` — scope via `project.ownerId`; verify `projectId` ownership on create/move (done 2026-10-06)
- [x] 3.10 `GET /api/tasks` with `projectId`, `search`, `status`, `priority` filters (done 2026-10-06)
- [x] 3.11 `GET /api/tasks/:id`, `POST /api/tasks`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id` (done 2026-10-06)
- [x] 3.12 "Mark completed" works via `PUT` `{status:"COMPLETED"}` (document in API docs) (done 2026-10-06)
- [x] 3.13 `GET /api/dashboard` using aggregate queries (`count`/`groupBy`), scoped to user (done 2026-10-06)
- [x] 3.14 Remove `members` routes/controllers, `adminonly`, old `PATCH` routes (done 2026-10-06)
- [x] 3.15 Serializers: whitelist response fields; confirm `passwordHash` can't leak (done 2026-10-06)

---

## Phase 4 — Backend Tests 🔴/🟡
- [x] 4.1 Install Jest + Supertest; `npm test` script; test DB setup/teardown (done 2026-10-07)
- [x] 4.2 Auth tests: register OK / duplicate email 409 / invalid email 400 / short password 400 (done 2026-10-07)
- [x] 4.3 Auth tests: login OK / wrong password 401 / unknown email 401 (same message) (done 2026-10-07)
- [x] 4.4 Auth tests: `/me` without token 401, expired token `TOKEN_EXPIRED`, revoked token after logout (done 2026-10-07)
- [x] 4.5 Rate-limit test: N+1 login attempts → 429 (done 2026-10-07)
- [x] 4.6 Project CRUD tests (expected, edge: empty name / bad dates, failure: bad UUID) (done 2026-10-07)
- [x] 4.7 Task CRUD tests (expected, edge: no due date, failure: invalid enum) (done 2026-10-07)
- [x] 4.8 **Authorization tests:** user B gets 404 on user A's project/task for GET/PUT/DELETE; B can't create task in A's project (done 2026-10-07)
- [x] 4.9 Filter/search tests for projects and tasks (done 2026-10-07)
- [x] 4.10 Dashboard test: counts correct and scoped per user (done 2026-10-07)
- [x] 4.11 Response-shape test: no `passwordHash` in any response (done 2026-10-07)

---

## Phase 5 — Web Frontend (Next.js) 🔴
- [x] 5.1 Create `.env.example`; reconcile `NEXT_PUBLIC_API_URL` usage with README (done 2026-10-07)
- [x] 5.2 Build UI kit in `components/ui/`: Button, Input, Select, Modal, Spinner, Badge, EmptyState, Toast (Tailwind; replace inline styles) (done 2026-10-07)
- [x] 5.3 `lib/api.js`: base URL, auth header, **401 interceptor** → clear storage → `/login?expired=1` (done 2026-10-07)
- [x] 5.4 `AuthContext` / `useAuth` + route guard for protected pages (done 2026-10-07)
- [x] 5.5 Login & Register: `react-hook-form` + Zod, inline errors, loading state, server error display, "session expired" banner (done 2026-10-07)
- [x] 5.6 Logout: call `POST /auth/logout` then clear storage (done 2026-10-07)
- [x] 5.7 Dashboard: 5 stat cards (Total Projects, Total Tasks, Completed, Pending, Projects In Progress) from `GET /dashboard` (done 2026-10-07)
- [x] 5.8 Projects page: list as cards, search by name, status filter, create/edit modal, delete confirm (done 2026-10-07)
- [x] 5.9 Project detail `/projects/[id]`: project info + task list (done 2026-10-07)
- [x] 5.10 Task create/edit form (name, description, priority, status, due date), delete, **mark complete** toggle (done 2026-10-07)
- [x] 5.11 Task search + status filter + priority filter (server-side query params, debounced search) (done 2026-10-07)
- [x] 5.12 Tasks page (all tasks across projects) with the same filters (done 2026-10-07)
- [x] 5.13 Loading skeletons, empty states, error banners on every data view (done 2026-10-07)
- [x] 5.14 Responsive pass: navbar collapses to a menu on small screens; grids adapt (done 2026-10-07)
- [x] 5.15 Remove Members page/components and nav link (done 2026-10-07)
- [x] 5.16 Update navbar/branding for new nav: Dashboard · Projects · Tasks (done 2026-10-07)

---

## Phase 6 — Mobile App (Expo / React Native, Android) 🔴
- [x] 6.1 `npx create-expo-app mobile`; set up `expo-router`, `.env.example` (`EXPO_PUBLIC_API_URL`) (done 2026-10-08)
- [x] 6.2 Install `expo-secure-store`, `axios`, `@react-native-community/netinfo`, `react-hook-form`, `zod` (done 2026-10-08)
- [x] 6.3 `src/storage/token.js`: get/set/clear token via **SecureStore only** (done 2026-10-08)
- [x] 6.4 `src/api/client.js`: axios instance, bearer header, 401 `TOKEN_EXPIRED` handler → clear token → navigate to login with message (done 2026-10-08)
- [x] 6.5 No-network handling: NetInfo banner + `ERR_NETWORK` mapping → "No internet connection" + Retry (done 2026-10-08)
- [x] 6.6 Auth context + startup flow (token → `/auth/me` → route) (done 2026-10-08)
- [x] 6.7 Screens: Login, Register (validation, loading, errors) (done 2026-10-08)
- [x] 6.8 Dashboard screen with 5 stats + pull-to-refresh (done 2026-10-08)
- [x] 6.9 Projects list screen (+ search/status filter optional) with pull-to-refresh (done 2026-10-08)
- [x] 6.10 Project detail screen: tasks under the project (done 2026-10-08)
- [x] 6.11 Task create/edit screen (name, description, priority, status, due date picker) (done 2026-10-08)
- [x] 6.12 Delete task (confirm), mark completed, quick change of status and priority (done 2026-10-08)
- [x] 6.13 Task search + filter by status and priority (done 2026-10-08)
- [x] 6.14 Logout (server call + clear SecureStore) (done 2026-10-08)
- [x] 6.15 Phone UX polish: safe areas, keyboard avoidance, touch target sizes, empty/loading states (done 2026-10-08)
- [ ] 6.16 Test on Android emulator (`10.0.2.2`) **and** a physical device against the deployed backend (added 2026-10-06)
- [x] 6.17b Link mobile app to @keshavkss-team/taskflow (project df4037fe-88cc-4bb8-a5b9-399b0307991d); verify authenticated EAS access (done 2026-10-08)
- [x] 6.17a Configure eas.json preview profile for internal Android APK distribution (done 2026-10-08)
- [x] 6.17 Configure preview profile and build APK; user confirmed the replacement build completed, installed and login works (done 2026-10-08). A new build is required for subsequent project creation, icons and redesign changes.
- [x] 6.18 Publish EAS distribution page in README; previous APK installed/login confirmed by user. Updated design build page is linked; build completion and full device acceptance tracked separately (done 2026-10-08).

Phase 6 checkpoint (2026-10-08): original EAS build failed; replacement `44704206-7eda-4ff1-9173-33cb1638f8b3` completed and the user confirmed installation/login. A new APK is needed for project creation, native tab icons and Kanban styling. All 35 current mobile tests, lint and Android bundle export pass. Full phone acceptance and emulator verification remain pending; no local Android SDK/emulator is installed.

---

## Phase 7 — Deployment 🔴
- [x] 7.1 Neon PostgreSQL configured; Prisma migration status confirms both committed migrations applied (done 2026-10-08)
- [x] 7.2 Deploy backend on Render; environment configured and live health/protected endpoint checks passed (done 2026-10-08)
- [x] 7.3 Verify deployed Vercel login bundle points to the Render backend (done 2026-10-08)
- [x] 7.4 Configure deployed web origin in CORS_ORIGINS; preflight returns 204 with matching allow-origin (done 2026-10-08)
- [ ] 7.5 Smoke test the deployed stack end-to-end (register on web → login on mobile) (added 2026-10-06)
- [x] 7.6 Create reviewer@taskflow.example demo account, fictional project and task through the deployed API (done 2026-10-08)

Phase 7 checkpoint (2026-10-08): deployed API and website browser checks pass, including CRUD, authentication, responsive layout and session handling. Actual registration on web followed by login on the Android app remains pending in 7.5.

---

## Phase 8 — Documentation 🔴
- [x] 8.1 Rewrite README accurately around the implemented JavaScript/PostgreSQL stack (done 2026-10-08)
- [x] 8.2 Document backend, web and mobile setup commands (done 2026-10-08)
- [x] 8.3 Document environment variables per app, including reserved/unused pooled example (done 2026-10-08)
- [x] 8.4 Document existing DB-only Compose services, migrations and optional one-time test seed; Docker packaging remains last (done 2026-10-08)
- [x] 8.5 Document mobile setup against Render and EAS preview environment (done 2026-10-08)
- [x] 8.6 Add generated OpenAPI contract and public Swagger UI at /api/docs/; route tests and browser render pass (done 2026-10-08)
- [x] 8.7 Add API examples, schemas, response wrappers, filters and actual error codes (done 2026-10-08)
- [x] 8.8 Update ER diagram and export SVG/PNG matching the Prisma schema (done 2026-10-08)
- [ ] 8.9 Add architecture diagram + screenshots (web + mobile) to README (added 2026-10-06)
- [x] 8.10 Add docs/DESIGN_DECISIONS.md covering architecture, security, dates and delivery limits (done 2026-10-08)

Phase 8 checkpoint (2026-10-08): API/Swagger docs are deployed and verified; architecture, ER diagram and actual web screenshots are documented. Task 8.9 still requires actual Android screenshots.

Phase 8 verification (2026-10-08): OpenAPI standards validation, backend lint, npm 10 clean-install dry run, and 10 docs/middleware tests pass. Headless Chrome verified reviewer login, dashboard/projects and all 16 Swagger operations. Full database integration tests were not rerun; the docs changes require no schema/data changes.

---

## Phase 9 — QA & Submission 🔴
- [x] 9.9 Verify final backend docs rollout: Render /api/health, /api/docs/ and /api/docs/openapi.yaml return 200; unauthenticated /api/auth/me returns expected 401 (done 2026-10-08).

Latest deployment status (2026-10-08): Render deployment is verified successful. Earlier checkpoints recording Swagger 404 describe the rollout before completion; public docs now return 200. Web/browser checks and dedicated test-database verification also pass. Remaining Phase 9 acceptance requires the updated APK, phone/emulator checks, cross-platform sync, Android screenshots and demo recording.
- [ ] 9.1 Manual security checklist: other user's IDs → 404 on web **and** mobile; no token → 401; password never in responses; SQLi strings in search; oversized/invalid payloads (added 2026-10-06)
- [x] 9.1a Full backend authorization/input-security suite verified on isolated Neon test database: 70 tests pass. Native not-found UI acceptance remains in 9.1 (done 2026-10-08).
- [ ] 9.2 Manual UX checklist: validation errors, loading, empty states, expired-session message, airplane-mode message (added 2026-10-06)
- [x] 9.2a Redesigned local production web tested in actual Chrome: invalid form errors, filtered empty state, offline retry and expired-session redirect/token clearing pass. Phone UX checks remain in 9.2 (done 2026-10-08).
- [ ] 9.3 Cross-platform sync check: change on one platform appears on the other after refresh / pull-to-refresh (added 2026-10-06)
- [x] 9.4 Verify public GitHub access; targeted history credential-pattern scan of 693 reachable objects finds no matches or committed environment files (done 2026-10-08)
- [ ] 9.5 Record the **5-minute demo**: same account on web + mobile → create task on one → show on the other (+ brief security/expiry/offline demo if time) (added 2026-10-06)
- [ ] 9.6 Assemble submission: repo link, ER diagram, API docs, README, deployment URLs, APK/Expo link, recording (added 2026-10-06)

---

## Phase 5 browser checks (Phase 9 follow-up)
- [x] 9.7 Deployed Vercel/Render browser acceptance passes: project/task CRUD, dialog Tab/Escape/focus restoration, 360px web navigation and Kanban board without overflow, filtered empty states, offline retry and invalid-session clearing. Temporary fictional fixtures removed (done 2026-10-08).

- [x] 9.7a Local production web/browser QA with actual API/Neon fixtures: CRUD, modal focus/Escape/restoration, 360px navigation, empty states, offline retry and session clearing pass; deployed recheck remains in 9.7 (done 2026-10-08).
- [x] 9.7b Repeat browser acceptance after Kanban/sidebar redesign against separate taskflow_test database: project/task create/edit/complete/delete, dialog Tab/Escape/focus restoration, 360px navigation without overflow, empty search, offline retry and expired-session clearing pass (done 2026-10-08).
- [x] 9.6a Prepare docs/SUBMISSION.md, docs/QA_REPORT.md and five-minute docs/DEMO_SCRIPT.md; verified APK/device/recording links remain pending (done 2026-10-08).

Phase 9 checkpoint (2026-10-08): 70 backend, 30 web and 35 mobile tests pass (135 total); all lint/build checks pass. Local and deployed browser acceptance pass. Vercel redesign and Render Swagger/OpenAPI are verified live. Updated design APK 22403d8c-18ca-46af-b769-503ed0a94263 is IN_PROGRESS. Phone/emulator QA, cross-platform sync, native screenshots and recording remain pending.

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
- B10 — RBAC deferred: user confirmed keeping the single-account model with no admin/member roles; excluded from current work (updated 2026-10-08).

---

## 🔍 Discovered During Work
> Add new sub-tasks, bugs and TODOs here as they appear, with a date.

- [ ] D24 — Give both light-themed clients a professional but expressive visual hierarchy: vivid blue/indigo accents, richer dashboard cards, stronger typography and depth while preserving motion, accessibility and existing functionality (done 2026-10-08; 68 client tests, lint, web build, Android export and Chrome layout/reduced-motion checks pass).

- [x] D23a — Replace peach/terracotta appearance with professional stone/ivory/navy/teal palette on both clients; icons, motion and Kanban workflows retained. Web 30/mobile 38 tests, both lint checks, web build and Android export pass; actual Chrome theme/360px/reduced-motion checks pass (done 2026-10-08).
- [ ] D23b — Verify professional-theme mobile version 1.0.3/versionCode 4 on the phone after its replacement APK finishes (added 2026-10-08).

- [x] D22a — Implement warm cream/terracotta/sage theme on web and mobile, subtle web card/button/dialog animations and native screen fades/press feedback; reduced-motion tests pass. Web 30 tests, mobile 38 tests, both lint checks, web build and Android export pass. Actual local Chrome CRUD/keyboard/360px/offline/expiry/reduced-motion checks pass (done 2026-10-08).
- [ ] D22b — Build and install warm-theme Android version 1.0.2/versionCode 3; verify motion, contrast, icons and CRUD on the physical phone (added 2026-10-08).

- [x] D21 — Add matching web sidebar symbols; web tests (30), lint and production build pass. Prepare docs/RELEASE_ACCEPTANCE.md with exact remaining phone/emulator/sync/screenshot/recording steps and reconcile stale release notes (done 2026-10-08).

- [x] D20 — Finish legacy migration cleanup: replace unused MongoDB index.js with current app export and remove unused admin/member authMiddleware; 70 backend tests and lint pass (done 2026-10-08).

- [x] D19 — Validate dedicated Neon taskflow_test database, apply both committed migrations and rerun full backend suite: 70 tests across eight suites and backend lint pass; primary DATABASE_URL preserved (done 2026-10-08).

Phase 9 backend verification (2026-10-08): full backend suite passes on dedicated Neon taskflow_test; repeated after legacy cleanup with all 70 tests and lint passing.

- [x] D16 — Add mobile project creation using the shared API; 34 mobile tests, lint and Android bundle export pass (done 2026-10-08).
- [ ] 9.8 Verify mobile project creation in the rebuilt APK: optional dates, failed-save retry, list refresh and creation of tasks inside the new project (added 2026-10-08).
- [ ] D17 — Improve mobile styling, navigation icons and completion/delete colors; verify on Android (added 2026-10-08).
- [ ] D18 — Redesign both website and mobile with a Jira-inspired Kanban interface while keeping TaskFlow's dark theme and yellow brand accent (requested 2026-10-08).
- [x] D18a — Web sidebar and Pending, In Progress, Completed Kanban columns implemented; column grouping regression test passes (done 2026-10-08). Visual/live acceptance remains in D18f.
- [x] D18b — Mobile status tabs, colored status/priority badges and dashboard grid implemented; labelled tab icons retained and filtering test passes (done 2026-10-08). Phone acceptance remains in D18f.
- [x] D18c — Both clients: rounded cards, improved spacing, subtle borders, priority badges and due dates implemented; native mobile tab symbols and matching web sidebar symbols added. Device visual acceptance remains in D18f (done 2026-10-08).
- [x] D18d — Green completion, amber reopen and red delete actions implemented on both clients; labels, disabled states and delete confirmations preserved (done 2026-10-08).
- [x] D18e — Single-account ownership and shared endpoints preserved; no roles/member assignment introduced (verified 2026-10-08).
- [ ] D18f — Verify redesigned web/mobile create, edit, delete and status-change flows, responsive layouts and accessibility; run tests/lint/build checks and document actual device checks (added 2026-10-08).
- [ ] D18g — After the mobile redesign, build a replacement APK containing project creation, tab icons and the new design; update the distribution link and verify it on the user's Android phone (added 2026-10-08).

Redesign scope note (2026-10-08): Kanban columns and existing status controls are requested. Drag-and-drop was discussed as an optional additional interaction, not yet requested. Work stays on dev; main is used when needed for deployment. Commit completed work, and leave Docker until last.

Phase 9 active checkpoint (2026-10-08): redesigned code deployed via main; work continues on dev. Updated preview APK version 1.0.1/versionCode 2 is IN_PROGRESS. Dedicated test database verification and deployed web QA are complete; phone/emulator acceptance, sync, native screenshots and recording remain pending.
- [ ] D17a — Add Dashboard, Projects, Tasks and Account symbols to the mobile bottom tab bar; check Android rendering in the rebuilt APK (added 2026-10-08).
- [x] D17b — Implement native tab symbols with per-platform names, labels and active highlighting; mobile tests and lint pass (done 2026-10-08).

- [x] D13 — Malformed JSON maps to 400 VALIDATION_ERROR, oversized JSON to 413 PAYLOAD_TOO_LARGE and disallowed origins to 403 CORS_NOT_ALLOWED; tests and contract updated (done 2026-10-08).

- [x] D14 — Repair mobile ajv/@emnapi lockfile mismatch after failed EAS dependency install; full npm 10 clean install succeeds (done 2026-10-08).
- [x] D15 — Fix web task creation placeholder being treated as edit mode and restore dialog opener focus; regression tests and actual browser CRUD/keyboard checks pass (done 2026-10-08).

- [x] D12 — Reproduce Render's remaining @emnapi 1.11.3 lockfile failure with npm 10 and regenerate the lockfile using that version; npm 10 clean-install dry run, lint, and five middleware tests pass (done 2026-10-08).

- [x] D11 — Repair incomplete backend npm lockfile (@emnapi nested dependencies) causing Render npm ci EUSAGE; clean-install dry run and backend lint pass (done 2026-10-08).

- [x] D10 — Deploy current API to Render (`https://taskflow-1sh2.onrender.com`); health returns 200 and `/api/auth/me` and `/api/dashboard` return expected 401 without authentication (done 2026-10-08).

- [x] D5 — Fix Zod 4 validation errors and Express 5 parsed-query assignment; add middleware regression tests (done 2026-10-07).
- [x] D6 — Replace ESM-only UUID token import with Node crypto.randomUUID for CommonJS compatibility (done 2026-10-07).
- [x] D7 — Phase 4 verified: 53 tests across six suites passed against the current database with explicit user authorization; backend lint passed. Dedicated database guard restored afterward (done 2026-10-07).
- [x] D8 — Apply strict body/query/param schemas and actual calendar-date validation; test leap dates, invalid dates and mass assignment, and verify web/mobile payload compatibility (done 2026-10-08).

- [x] D1 — Current authenticate middleware maps JWT failures to 401; unused legacy authMiddleware removed (done 2026-10-08).
- [x] D2 — Strict registration schema rejects role input; no admin/member roles in the current model (verified 2026-10-08).
- [x] D3 — Project/task queries are ownership-scoped; full authorization suite passes on separate test database (verified 2026-10-08).
- [x] D4 — Web API URL reconciled with README and tracked .env.example (done 2026-10-07).

---

- [ ] D9 — Mobile device verification and APK distribution require Android emulator/physical device, Expo/EAS login, and the deployed HTTPS backend; app implementation passes automated checks (added 2026-10-08).

## ✔️ Completed Log
> Move finished items here with the completion date if this file gets long.

_(empty)_



Phase 5 automated verification (2026-10-07): 22 frontend tests across eight suites, lint, and production build passed. Browser/device checks remain in Phase 9.

Phase 6 implementation verification (2026-10-08): 35 mobile tests, lint and Android export pass; previous APK installed/login confirmed by user. Updated APK is building. Full device/emulator acceptance remains pending.
