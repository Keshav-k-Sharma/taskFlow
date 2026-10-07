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

| Variable | Example | Purpose |
| --- | --- | --- |
| `EXPO_PUBLIC_API_URL` | `http://10.0.2.2:5000/api` | Public API base embedded in the mobile bundle. Never put secrets here. |

For an Android emulator, `10.0.2.2` reaches the host computer. For a physical
phone, use the computer's LAN IP, such as `http://192.168.1.100:5000/api`, and
connect both devices to the same network. Allow the backend port through your
firewall. `localhost` on a phone points at the phone, not your computer.

Use an Expo Go version that supports SDK 57, or a compatible development build.
Restart Metro after changing `.env`. The app has native SecureStore, NetInfo,
and date-picker dependencies.

## Deployed backend

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
link in the README once the build succeeds; no distribution link is available yet.

See the official [APK build guide](https://docs.expo.dev/build-reference/apk/) and
[Expo Router authentication guide](https://docs.expo.dev/router/advanced/authentication/).
