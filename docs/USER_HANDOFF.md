# Remaining release steps

Updated 2026-10-08. Implementation and automated client checks are complete;
these steps require your computer, phone or recording account.

1. Open the [APK 1.0.4 build](https://expo.dev/accounts/keshavkss-team/projects/taskflow/builds/38921ae0-d88b-4831-b761-e7af1eee7b9a).
   It was queued at the latest check. Once Finished, download and install it.
2. Register a fictional test account at https://taskflow26.vercel.app, then
   sign into the phone app with that same email/password.
3. Create a project and task on the website. Refresh the app and confirm both
   appear. Change the task status on the app and refresh the website.
4. On the app, test project/task creation, editing, completion and deletion;
   check navigation symbols, readable colors, empty states, invalid form errors,
   airplane-mode errors and retry. Follow [release acceptance](RELEASE_ACCEPTANCE.md)
   for the remaining security, session and accessibility checks. Report failures
   with the screen, action and visible error; do not share credentials.
5. Capture Dashboard, Projects, task board and task form screenshots on the
   phone. Emulator acceptance also remains open: install Android Studio and an
   Android emulator if you want to complete that requirement.
6. Record the five-minute demonstration using [DEMO_SCRIPT.md](DEMO_SCRIPT.md).
   Show the same account on both clients and a task appearing after refresh.
   Upload the recording somewhere the reviewer can open.
7. Install and start Docker Desktop with Linux containers. Stop any local
   backend using port 5000. From the repository root, run:

   ```powershell
   docker compose --env-file backend/.env config --quiet
   docker compose --env-file backend/.env up --build -d
   docker compose --env-file backend/.env ps
   Invoke-RestMethod http://localhost:5000/api/health
   ```

   Confirm both services are healthy and the health response says UP. Open
   http://localhost:5000/api/docs/. Compose uses local PostgreSQL, independently
   of Neon. Stop it with `docker compose --env-file backend/.env down`.
   Docker runtime verification is pending because Docker is absent here.
8. Add the recording link and mobile screenshots to the prepared
   [submission checklist](SUBMISSION.md), verify the APK/recording links open
   for the reviewer, and submit the repository, web/API URLs and deliverables.

Pagination, CI, refresh tokens, shared schemas, offline caching, notifications
and audit logs remain optional bonus work; they are not required for this handoff.
