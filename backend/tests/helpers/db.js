/**
 * Global test setup — runs once before all test suites.
 * Cleans the test database in dependency order so every test run starts fresh.
 */
const prisma = require("../../src/db/prisma");

/**
 * Wipes all data in the correct foreign-key order.
 * Called before each test file via jest globalSetup or beforeAll.
 */
async function cleanDatabase() {
  if (process.env.NODE_ENV !== "test" ||
      !new URL(process.env.DATABASE_URL).pathname.endsWith("_test")) {
    throw new Error("Refusing to clean a non-test database");
  }
  // Reason: Delete in reverse FK dependency order to avoid constraint errors
  await prisma.revokedToken.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
}

module.exports = { prisma, cleanDatabase };

