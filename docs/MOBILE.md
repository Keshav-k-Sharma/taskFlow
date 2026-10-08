# TaskFlow Android app

The JavaScript Expo SDK 57 app uses the same Express API and PostgreSQL data as
the web. There is no mobile backend. Access tokens are stored only in
`expo-secure-store`. Login/registration errors remain on the form; rejected
sessions clear the secure token and return to login with an expiry message.

## Local setup

Start the backend separately, then run:

```powershell
cd C:\projects\taskFlow\mobile
npm ci
Copy-Item .env.example .env
npm start
```

| Variable              | Example                    | Purpose                                                                |
| --------------------- | -------------------------- | ---------------------------------------------------------------------- |
| `EXPO_PUBLIC_API_URL` | `http://10.0.2.2:5000/api` | Public API base embedded in the mobile bundle. Never put secrets here. |

For an Android emulator, `10.0.2.2` reaches the host computer. For a physical
phone, use the computer's LAN IP, such as `http://192.168.1.100:5000/api`, and
connect both devices to the same network. Allow the backend port through your
firewall. `localhost` on a phone points at the phone, not your computer.

Use an Expo Go version that supports SDK 57, or a compatible development build.
Restart Metro after changing `.env`. The app has native SecureStore, NetInfo,
and date-picker dependencies.

## Deployed backend

The deployed backend is `https://taskflow-1sh2.onrender.com/api`.
The EAS `preview` environment is configured with this URL (2026-10-08).

Set `EXPO_PUBLIC_API_URL=https://your-backend.example/api` in `mobile/.env` before
starting Metro or building an APK. Use the same backend URL configured for web.
For a cloud EAS build, configure the variable in the Expo project's EAS
environment; the preview profile uses the `preview` environment. The `.env` file
is ignored by Git and is not a reliable way to configure remote builds.

The backend's `/api/health` should respond successfully before attempting login.
Sign in with the same account as on the web. Mobile sends the same endpoints,
payloads, enum values, and calendar dates. Pull to refresh lists/dashboard after
making changes on the other platform. Screens also reload when they regain focus.

## Checks

```powershell
cd C:\projects\taskFlow\mobile
npm test
npm run lint
npx expo-doctor
npx expo export --platform android --output-dir dist
```

Tests mock native modules and API calls, including token storage, expiry, startup,
offline retry, form validation, task payloads, and cancellation of stale requests.
The Metro export verifies an Android JavaScript bundle; it is not an installable APK.
The `dist/` output is ignored. Device checks remain in `TASK.md`.

## APK build and sharing

EAS Build is Expo's hosted Android/iOS build service. A login is required to
associate the project, signing credentials, and build artifact with an account.
Create an account at <https://expo.dev/signup>, then sign in locally:

```powershell
npx eas-cli@latest login
npx eas-cli@latest whoami
npx eas-cli@latest init
```

Do not paste passwords or access tokens into chat or commit them. After linking
the project and setting the deployed API URL in the EAS `preview` environment:

```powershell
npx eas-cli@latest build --platform android --profile preview
```

The preview profile in `eas.json` requests internal distribution and an APK.
Follow EAS prompts to configure Android signing. Use the resulting EAS build page
to download/install the APK and share its link with reviewers. Record that real
link in the README once the build succeeds. The current and earlier build pages are linked below.

See the official [APK build guide](https://docs.expo.dev/build-reference/apk/) and
[Expo Router authentication guide](https://docs.expo.dev/router/advanced/authentication/).

Android preview build submitted on 2026-10-08:
[EAS build status](https://expo.dev/accounts/keshavkss-team/projects/taskflow/builds/5188b0a3-d75f-4128-973d-dd5a6f5f71cf).
This original build failed during dependency installation. Phase 9 repaired the
lockfile and verified a full npm 10 clean install.
The original build is superseded by the working replacement below.

Replacement build submitted on 2026-10-08 after 30 mobile tests, lint and Android
bundle export passed:
[Latest EAS build](https://expo.dev/accounts/keshavkss-team/projects/taskflow/builds/44704206-7eda-4ff1-9173-33cb1638f8b3).
The user confirmed this APK completed, installed, and login works on the Android phone (2026-10-08). Subsequent project creation, native tab icons and Kanban styling require a replacement APK; full device acceptance remains pending.

## Device acceptance checklist

Kanban/design update submitted on 2026-10-08 (version 1.0.1, Android version code 2):
[Updated APK build](https://expo.dev/accounts/keshavkss-team/projects/taskflow/builds/22403d8c-18ca-46af-b769-503ed0a94263).
This build includes project creation, bottom tab symbols, status tabs and colored actions.
Submission does not imply build completion or device verification.

Once the build finishes, open its EAS page on an Android phone, download the APK,
and allow installation from that browser when Android prompts. Run these checks
against the deployed backend:

1. Register a test account, log out, and log in again.
2. Create a project and a task; verify the dashboard counts update.
3. Edit task priority, status, and due date; search/filter tasks and mark one completed.
4. Pull to refresh and confirm a change made on the web appears on the phone.
5. Close and reopen the app; confirm the session restores.
6. Enable airplane mode; confirm the offline message, then reconnect and retry.
7. Delete the test task with confirmation, log out, and confirm protected screens are inaccessible.

Record results and any failures in `TASK.md`. Repeat these checks on an Android
emulator before closing task 6.16. The user has an Android phone; this workspace
does not currently have Android Studio or an Android SDK (checked 2026-10-08).
