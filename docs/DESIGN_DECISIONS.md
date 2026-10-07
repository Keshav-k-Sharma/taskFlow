# Review notes

## One shared API and database

Next.js and Expo send identical payloads to Express. There is no mobile-only
backend, sync queue or duplicate DB. A refresh reloads the same records. Neon
hosts PostgreSQL because the task requires a relational DB and Prisma provides
parameterized queries, migrations, enums and foreign keys.

## Ownership and 404

User IDs come from verified JWTs. Project queries filter owner_id. Task queries
filter through project.owner_id; task creation first checks the parent project.
Tasks have no duplicate owner_id because project ownership already determines
it. Missing and foreign IDs both return 404, reducing resource enumeration.

## Passwords, tokens and logout

bcryptjs hashes with cost 12. User serializers whitelist public fields. JWTs use
an environment-provided secret, sub for the user, jti for the session token, and
expiry. Logout inserts jti into revoked_tokens until expiry; authentication checks
that table, and server startup/hourly cleanup removes expired revocations.
Revocation does not log out every session. Refresh tokens remain a bonus.

SecureStore protects Android tokens. Web uses localStorage for this task's bearer
flow, with an acknowledged XSS exposure. A future production design could use
short access tokens plus rotated refresh tokens in httpOnly cookies; that needs
separate CSRF/session decisions and is not silently implemented here.

## Layers and validation

Routes wire middleware/controllers; controllers shape HTTP; services own database
access and business rules. Zod validates bodies, queries and UUIDs. Prisma and
database constraints provide a second boundary. Strict unknown-field rejection
and real calendar-date validation are outstanding D8 work: current schemas strip
unknown fields and check date patterns. Explain the current behavior accurately.

Date inputs are calendar strings; response dates are UTC timestamps. Clients
must preserve the intended calendar day when displaying/editing them.

## Rate limits, hosting and CORS

Render runs a persistent API process, which fits process-local rate limiters.
Login/register share a tighter per-IP limiter. Multiple instances would need a
shared rate-limit store. Trust proxy is set to one hop for the current hosting.
Helmet adds headers, Pino redacts credentials, and CORS allows complete configured
web origins. Native apps send no Origin and use the same authenticated routes.
CORS is a browser policy; ownership/authentication remain the actual data boundary.

## Dashboard and deletion

Pending means PENDING only; IN_PROGRESS tasks count in totalTasks. Counts use
owner-scoped Prisma queries. Deleting a project cascades tasks through foreign
keys. Confirmation UI is therefore important: the cascade is intentional.

## Tests and delivery limits

Backend route tests use Jest/Supertest and a dedicated database ending in _test.
The guard prevents cleanup against developer/reviewer data. Client tests cover
token/session/network/form logic. Metro export proves bundling, not APK install
or usability. Phase 6/7 device checks and Phase 9 manual security/UX checks must
remain open until observed on the real platforms.

Swagger UI reads the committed YAML contract and has no persisted authorization.
Public docs contain schemas/examples only. The API documentation dependency is
swagger-ui-express; yaml parses and generates the OpenAPI contract. Docker is
reserved for the user's final task.
