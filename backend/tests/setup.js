// Reason: Never inherit the development DATABASE_URL or secrets from .env.
process.env.NODE_ENV = "test";
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL ||
  "postgresql://user:password@localhost:5433/taskflow_test";
const testUrl = new URL(process.env.DATABASE_URL);
if (!['postgresql:', 'postgres:'].includes(testUrl.protocol) ||
    !decodeURIComponent(testUrl.pathname).endsWith('_test')) {
  throw new Error("Tests require a dedicated PostgreSQL database whose name ends in _test");
}
process.env.JWT_SECRET = "taskflow-test-secret-only-at-least-32-characters";
process.env.LOG_LEVEL = "fatal";
process.env.RATE_LIMIT_AUTH_MAX = "5";
