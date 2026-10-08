# Remaining release acceptance

Updated 2026-10-08. Automated checks and deployed website acceptance are recorded in QA_REPORT.md. This checklist covers the evidence still needed to close Phases 6–9.

## Android phone

Open [warm-theme APK build](https://expo.dev/accounts/keshavkss-team/projects/taskflow/builds/0cbeb6a0-0194-414e-81a7-d738fd6ebcc2). Wait for Finished, then install version 1.0.2 over the earlier APK. Earlier build links do not contain the warm theme and animations.

1. Register a fictional account on https://taskflow26.vercel.app, then log into Android with that account.
2. Confirm Dashboard, Projects, Tasks and Account symbols appear; verify Create project is available.
3. Create a project and task on Android. Edit task status, priority and date; mark complete, reopen and delete with confirmation.
4. Create another task on web; refresh Android and find it. Change its status on Android, then refresh web and confirm the same change.
5. Search/filter tasks, try an empty required name, restart the app to check session restoration, and log out to check protected screens.
6. Enable airplane mode, confirm the offline message, reconnect and retry.
7. Report each step as pass/fail, with the screen and action for any failure. Do not send account passwords or tokens.

## Evidence

- Share actual Android screenshots of Dashboard, Projects, Tasks and task form with fictional data and notifications hidden. These close the native screenshot requirement in Phase 8.
- Follow DEMO_SCRIPT.md for the five-minute web/Android sync recording, then provide a sharing link reviewers can open.
- Emulator testing remains required by task 6.16. This workspace has no Android SDK/emulator; it needs an available configured Android emulator before this check can be completed.

Keep these checks open until their results are recorded. APK build completion alone does not prove Android behavior or cross-platform sync.
