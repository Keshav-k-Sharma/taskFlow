# TaskFlow

TaskFlow is a project and task manager with a Next.js web app and an Expo Android
app. Both use one Express API and one PostgreSQL database. Each user can access
only their own projects and the tasks within them.

| Link                           | Location                                                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Web                            | https://taskflow26.vercel.app                                                                                            |
| API                            | https://taskflow-1sh2.onrender.com/api                                                                                   |
| API reference                  | [docs/API.md](docs/API.md)                                                                                               |
| OpenAPI contract               | [docs/openapi.yaml](docs/openapi.yaml)                                                                                   |
| Android build                  | [Professional-theme APK build](https://expo.dev/accounts/keshavkss-team/projects/taskflow/builds/7dde7951-5887-4011-9e98-46a2e6f870c7) |
| Mobile setup and device checks | [docs/MOBILE.md](docs/MOBILE.md)                                                                                         |
| Database model                 | [docs/ER_DIAGRAM.md](docs/ER_DIAGRAM.md)                                                                                 |
| Review notes                   | [docs/DESIGN_DECISIONS.md](docs/DESIGN_DECISIONS.md)                                                                     |

Deployment checks passed on 2026-10-08. The initial Android build failed dependency
installation; the replacement APK completed and the user confirmed installation and login.
The redesign requires another APK; full physical/emulator testing remains pending. See [TASK.md](TASK.md)
for completion status. Public Swagger UI is deployed at
[API documentation](https://taskflow-1sh2.onrender.com/api/docs/).

## Features and stack

- Register, login, restore a session, and revoke the current token on logout.
- Create, view, edit, and delete projects; deleting a project cascades its tasks.
- Create, edit, delete, and complete tasks with status, priority, and due dates.
- Search names and filter projects by status; filter tasks by project, status, and priority.
- Five owner-scoped dashboard counts, responsive web UI, mobile pull to refresh,
  loading/empty/error states, and mobile offline/expired-session handling.
- Create projects directly in the mobile Projects tab, including status and optional start/end dates.
- Mobile bottom navigation includes native Dashboard, Projects, Tasks and Account icons via Expo Symbols.
- Jira-inspired web task boards group work into Pending, In Progress and Completed columns; mobile status tabs provide the same workflow with colored badges and completion/reopen/delete actions.
- Both clients use professional light stone/ivory surfaces, navy actions and muted teal accents. Web cards/dialogs and mobile screen entrances animate gently; reduced-motion preferences disable these animations.

JavaScript throughout: Node.js 22+, Express 5, Prisma 5, PostgreSQL, Zod, bcryptjs,
JWT, Helmet, Pino, Jest/Supertest, Swagger UI and YAML. Web uses Next.js 16,
React 19, Tailwind CSS v4, React Hook Form and axios. Mobile uses Expo SDK 57,
Expo Router, SecureStore, NetInfo, React Hook Form and axios.

Members, roles, admin access, pagination, refresh tokens, offline caching,
notifications, and CI are not implemented core features.

## Architecture

```mermaid
flowchart TD
  Web["Next.js web · Vercel"] -->|HTTPS /api · Bearer JWT| API
  Mobile["Expo Android · SecureStore"] -->|HTTPS /api · Bearer JWT| API
  API["Express 5 · Render"] --> Routes["Routes → validation → controllers"]
  Routes --> Services["Services · ownership checks"]
  Services --> Prisma["Prisma"]
  Prisma --> DB[("PostgreSQL · Neon")]
```

![Architecture](docs/images/architecture.png)

Backend code is in backend/src/{routes,controllers,services,validators,middleware}.
Prisma schema/migrations live in backend/prisma. Web routes are frontend/src/app;
mobile routes are mobile/app, with shared mobile logic in mobile/src.

## Prerequisites

- Node.js 22 LTS or newer and npm. Render uses Node 22 and npm 10; backend lockfile
  changes should also be checked with npm 10.
- PostgreSQL locally or a Neon connection string. Docker is optional for local DBs;
  its final setup remains assigned to the user.
- An Android phone or emulator for device QA. EAS can build without a local Android SDK.
- Git. Run each package's commands from its own directory.

PowerShell examples use npm.cmd/npx.cmd to avoid execution-policy errors.
On macOS/Linux, use npm/npx and cp instead of Copy-Item.

## Database and backend setup

```powershell
git clone https://github.com/Keshav-k-Sharma/taskFlow.git
cd taskFlow
git switch dev
cd backend
npm.cmd ci
Copy-Item .env.example .env
```

Edit backend/.env with a real PostgreSQL DATABASE_URL and a random JWT_SECRET
(at least 32 characters). Generate the secret locally with
`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
Never share or commit the result.

Use an existing local PostgreSQL database, Neon, or the existing DB-only Compose
services from the repository root:

```powershell
docker compose up -d db db_test
```

Those services expose development taskflow on port 5432 and separate taskflow_test
on port 5433, with the example user/password. A backend Dockerfile/service is not
yet provided; do not treat this as completed Docker packaging.

From backend:

```powershell
npx.cmd prisma generate
npx.cmd prisma migrate deploy
node prisma/seed.js
npm.cmd run dev
```

migrate deploy applies committed migrations. For a new schema change in development,
use prisma migrate dev --name descriptive_name and commit the new migration.
Do not edit an applied migration or use manual SQL schema changes.

The optional seed inserts fictional test@example.com / password123 data and one
project/task. Run it once on a disposable development DB; it is not idempotent.
Do not run it against live/user data. The separately created hosted reviewer
account is reviewer@taskflow.example; obtain its demo password from the author.

Check http://localhost:5000/api/health (process liveness) and
http://localhost:5000/api/docs/ (interactive API documentation).

## Web setup

In a second terminal:

```powershell
cd taskFlow/frontend
npm.cmd ci
Copy-Item .env.example .env.local
npm.cmd run dev
```

Open http://localhost:3000. NEXT_PUBLIC_API_URL defaults to
http://localhost:5000/api; a base without /api is also normalized by the web client.
Restart the dev server after changing environment variables. For production:
npm.cmd run build, then npm.cmd start.

## Mobile setup and APK

```powershell
cd taskFlow/mobile
npm.cmd ci
Copy-Item .env.example .env
npm.cmd start
```

Set EXPO_PUBLIC_API_URL to http://10.0.2.2:5000/api for an Android emulator.
For a physical phone, use your computer's LAN IP and the same Wi-Fi network, or
https://taskflow-1sh2.onrender.com/api for the deployed backend. localhost on a
phone points at the phone. Restart Metro after changing .env.

Use an Expo Go version compatible with SDK 57 or a compatible development build.
See [mobile instructions](docs/MOBILE.md) for native module considerations,
the acceptance checklist, and cloud builds. The EAS preview environment already
contains EXPO_PUBLIC_API_URL=https://taskflow-1sh2.onrender.com/api.

```powershell
npx.cmd eas-cli@latest login
npx.cmd eas-cli@latest build --platform android --profile preview
```

The preview profile requests an internally distributed APK; production requests
an app bundle. Do not start a duplicate while the submitted build is queued.
Download/install from the linked build page once it finishes, then verify the
same account and task data on web and phone.

## Environment variables

backend/.env:

| Variable             | Example/default                                         | Purpose                                                       |
| -------------------- | ------------------------------------------------------- | ------------------------------------------------------------- |
| PORT                 | 5000                                                    | Listening port; honor the hosting provider's value            |
| NODE_ENV             | development                                             | development, production, or test                              |
| DATABASE_URL         | postgresql://user:password@localhost:5432/taskflow      | Runtime PostgreSQL connection                                 |
| TEST_DATABASE_URL    | postgresql://user:password@localhost:5433/taskflow_test | Dedicated test DB, name must end in _test                     |
| DATABASE_URL_POOLED  | optional PostgreSQL URL                                 | Reserved example only; current Prisma schema does not read it |
| JWT_SECRET           | random value of at least 32 characters                  | JWT signing key; distinct local/production secrets            |
| JWT_EXPIRES_IN       | 24h                                                     | Access-token lifetime                                         |
| CORS_ORIGINS         | http://localhost:3000                                   | Comma-separated complete origins, without trailing slashes    |
| LOG_LEVEL            | debug in example; info default                          | trace, debug, info, warn, error, fatal                        |
| RATE_LIMIT_AUTH_MAX  | 5                                                       | Combined login/register requests per IP per window            |
| RATE_LIMIT_WINDOW_MS | 900000                                                  | Auth limiter window in milliseconds                           |

frontend/.env.local:

| Variable            | Example                   | Purpose                                        |
| ------------------- | ------------------------- | ---------------------------------------------- |
| NEXT_PUBLIC_API_URL | http://localhost:5000/api | Public browser API URL, embedded at build time |

mobile/.env or EAS preview environment:

| Variable            | Example                  | Purpose                                   |
| ------------------- | ------------------------ | ----------------------------------------- |
| EXPO_PUBLIC_API_URL | http://10.0.2.2:5000/api | Public mobile API URL, embedded in bundle |

Only the API URL belongs in public client variables. Secrets belong in the backend
environment. All .env files are ignored; .env.example files are tracked.

## Testing

Run backend integration tests only on a dedicated PostgreSQL database whose name
ends in _test. Tests remove its rows. Never set TEST_DATABASE_URL to development,
Neon reviewer, or production data.

```powershell
cd taskFlow/backend
$env:TEST_DATABASE_URL = "postgresql://user:password@localhost:5433/taskflow_test"
$env:DATABASE_URL = $env:TEST_DATABASE_URL
npx.cmd prisma migrate deploy
npm.cmd test
npm.cmd run lint
```

Use a fresh terminal afterward so test environment variables do not affect the
development server. Jest sets NODE_ENV=test and validates the separate DB name.

```powershell
cd taskFlow/frontend
npm.cmd test
npm.cmd run lint
npm.cmd run build
```

```powershell
cd taskFlow/mobile
npm.cmd test
npm.cmd run lint
npx.cmd expo-doctor
npx.cmd expo export --platform android --output-dir dist
```

The Android JavaScript export is not an APK. Unit checks do not replace actual
browser, emulator, phone, offline and cross-platform verification.
Regenerate API docs after changing the documented contract with
`node backend/scripts/generateOpenapi.cjs` from the repository root.

## Deployment

Work on dev; merge to main only for a reviewed deployment. Render deploys main
with root directory backend:

- Build: npm ci && npx prisma generate
- Start: npx prisma migrate deploy && npm start
- Set DATABASE_URL (Neon), random JWT_SECRET, NODE_ENV=production,
  CORS_ORIGINS=https://taskflow26.vercel.app, and other backend variables as needed.

Vercel hosts frontend: set NEXT_PUBLIC_API_URL to the Render API URL and rebuild
when it changes. CORS_ORIGINS must contain the full frontend origin; port 3000
alone does not match an origin. Expo uses the same API through the preview
environment. The old backend Vercel deployment was retired; backend/vercel.json
is retained for the retired hosting setup. src/index.js exports the current app
for compatibility; npm start uses src/server.js.

## Security and current limits

Services scope projects to the authenticated user and tasks through their parent
project. Missing and foreign resources both return 404. Passwords use bcrypt cost
12; responses use whitelisted fields. JWT failures return 401 and logout revokes
the current token's jti until expiry. Auth requests retain their rate limiter.

Web tokens are stored in localStorage, which is accessible to scripts: XSS would
expose a token. Mobile tokens use SecureStore exclusively. JWT revocation is
server-side, but other sessions stay valid until their own expiry/logout.

Strict schemas reject unknown request fields and impossible calendar dates.
Malformed JSON returns 400, oversized JSON returns 413, and disallowed CORS
origins return 403. Rate limits use process-local memory. Lists are unpaginated.
See TASK.md rather than assuming every planned feature is finished.

## Screenshots and submission

![Professional web Kanban board](docs/images/professional-web-kanban.png)

See [screenshots and capture checklist](docs/SCREENSHOTS.md). Android screenshots
and the five-minute cross-platform recording require the APK and device testing.
The submission also needs the repo, deployment URLs, API docs, ER diagram and
verified APK sharing link. No demo recording is available yet.

See [QA evidence](docs/QA_REPORT.md), [submission checklist](docs/SUBMISSION.md),
and [five-minute demo script](docs/DEMO_SCRIPT.md). The Kanban redesign and API
documentation are deployed; follow-up work and verification records are on dev.
For exact phone checks and evidence still needed, follow [release acceptance](docs/RELEASE_ACCEPTANCE.md).
