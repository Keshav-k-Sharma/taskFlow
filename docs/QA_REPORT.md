# QA evidence and remaining acceptance checks

Date: 2026-10-08. Branch: dev. Checks below apply to the updated local code unless
explicitly labeled deployed. Changes have not yet been merged to main.

## Observed checks

| Area                         | Evidence                                                                    | Result                                                                                       |
| ---------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Repository visibility        | Unauthenticated GitHub API request                                          | Public, HTTP 200                                                                             |
| Secret history scan          | 693 reachable objects reviewed; credential-pattern scan of text-sized blobs | No matches for credential-bearing DB URLs, private keys, GitHub/AWS keys or JWTs             |
| Environment files            | Current tracked files and history of known .env paths                       | No committed .env files found                                                                |
| Ownership                    | Local API against Neon, two fictional accounts                              | Foreign project/task GET, PUT, DELETE return 404; creating under foreign project returns 404 |
| Missing authentication       | Projects, tasks, dashboard                                                  | 401                                                                                          |
| Response safety              | All API smoke responses                                                     | No passwordHash/password_hash fields                                                         |
| SQL-like search              | Name search using a quoted OR expression                                    | Empty matching list, no query error or data leakage                                          |
| Calendar dates               | Schema tests and authenticated task update                                  | Impossible dates rejected with 400; leap dates and nullable fields accepted                  |
| Mass assignment              | Strict schemas and registration route test                                  | Protected and unknown fields rejected with 400                                               |
| Request errors               | Supertest route checks                                                      | Malformed JSON 400, oversized body 413, disallowed origin 403                                |
| Native request compatibility | Health request without Origin                                               | 200                                                                                          |
| Browser forms and CRUD       | Headless Chrome, actual local production build/API                          | Login validation; project/task creation, task editing/completion and deletion pass           |
| Dialog keyboard behavior     | Native Chrome dialogs                                                       | Tab cycle stays in modal scope; Escape closes; opener focus restored                         |
| Responsive navigation        | 360px viewport                                                              | Menu works; no horizontal overflow                                                           |
| Empty state                  | Nonmatching project search                                                  | Appropriate empty message                                                                    |
| Web network retry            | Browser context switched offline/online                                     | Error and Retry recover without reload                                                       |
| Web invalid session          | Invalid persisted token                                                     | Redirect to login with expiry message; token removed                                         |
| Automated backend checks     | Docs, input security, validation, limiter suites                            | 22 tests pass; lint passes                                                                   |
| Automated web checks         | Full client suite and production build                                      | 29 tests pass; lint/build pass                                                               |
| Automated mobile checks      | Full client suite                                                           | 30 tests and lint pass; cloud install verification recorded in TASK.md                       |
| OpenAPI                      | Standards validator                                                         | Valid                                                                                        |

The scanner was a targeted pattern scan, not a guarantee that arbitrary secrets
are absent. It did not print credential values. New QA projects/tasks were
removed through their authenticated owner after checking them; pre-existing
reviewer records were preserved. One random-password fictional isolation account
remains without projects/tasks. These were individual API smoke actions, not a
destructive Jest cleanup of the shared database.

Full backend DB integration tests were not rerun in this checkpoint because they
require a dedicated _test database. Their previous pass is recorded in TASK.md.
Do not point the test cleanup at the shared reviewer database.

## Fixes found during QA

- Strict request schemas and Zod calendar dates replace silent stripping and
  regex-only dates. API docs describe the updated contract on dev.
- JSON parser failures map to safe 400/413 responses; CORS rejection maps to a
  deliberate 403 without logging parser bodies.
- New web task forms receive an empty item placeholder. They now use item.id to
  distinguish editing, keep project selection enabled and send projectId when
  creating. The shared save helper also omits projectId on task updates.
- Dialog unmount explicitly restores opener focus when that element still exists.
- The original Android build failed npm ci due to missing/mismatched nested
  ajv/@emnapi entries. The lockfile was regenerated and checked with npm 10;
  replacement build 44704206-7eda-4ff1-9173-33cb1638f8b3 completed and the user confirmed installation and login.
  Full clean install, 30 mobile tests, lint and Android bundle export pass.
  This earlier APK does not include the subsequent project creation, tab icons or redesign.

## Still required

1. Deploy dev's fixes and Swagger documentation to main when authorized; repeat
   browser checks against deployed web/Render, not only local servers.
2. Finish the replacement APK, install on an Android phone and test on an emulator.
3. On both clients, confirm foreign resource IDs show the safe not-found UI.
4. On Android, verify loading, empty states, invalid forms, expiry, airplane mode,
   reconnection, pull to refresh and session restoration after restart.
5. Create/update a task on web and observe it on Android after refresh, then repeat
   in the opposite direction with the same account.
6. Capture native Android screenshots and record the five-minute demo.
7. Rerun DB integration suites against a separate test DB before final submission.

See [SUBMISSION.md](SUBMISSION.md) and [DEMO_SCRIPT.md](DEMO_SCRIPT.md). These pending
items are not marked complete in TASK.md.
## Kanban redesign checkpoint — 2026-10-08

Repeated actual headless Chrome acceptance against the redesigned local production web build and a local API connected to `taskflow_test`: project/task create/edit/complete/delete, dialog Tab/Escape/focus restoration, 360px navigation without overflow, empty search, network retry and invalid-session clearing all pass. Test resources were removed by the QA flow. This verifies the local redesign, not the deployed website or physical Android UI.

Backend follow-up: the user configured a dedicated Neon `taskflow_test` database. Validated that it differs from the primary database, applied both committed Prisma migrations, and ran the complete Jest suite with `TEST_DATABASE_URL`: all 70 tests across eight suites pass. Backend lint also passes. No primary database setting was changed. Total current automated coverage is 135 tests across the three packages. Latest design APK build `22403d8c-18ca-46af-b769-503ed0a94263` remains `IN_QUEUE`.

Web sidebar and three status columns, mobile status tabs and dashboard grid, colored task badges and action colors implemented on dev. Web: 30 tests, lint and production build pass. Mobile: 35 tests, lint and Android bundle export pass. Native tab icons were previously bundle-verified. Automated checks do not establish visual/device acceptance. Live deployment, updated Android APK acceptance, responsive keyboard checks, cross-platform sync, screenshots and recording remain pending. The user confirmed the previous APK installed and login works. Full backend integration rerun requires a dedicated test database.
