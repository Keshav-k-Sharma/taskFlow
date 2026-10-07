/** @jest-environment node */
import { test, expect, beforeEach, afterEach } from "@jest/globals";
import { authorizeRequest, rejectResponse } from "@/lib/api";

beforeEach(() => {
  global.window = {
    localStorage: {
      getItem: jest.fn(() => "test-token"),
      removeItem: jest.fn(),
    },
    location: { assign: jest.fn() },
  };
});
afterEach(() => {
  delete global.window;
});
test("requests attach the persisted bearer token", () => {
  expect(authorizeRequest({ headers: {} }).headers.Authorization).toBe(
    "Bearer test-token",
  );
});
test("a protected 401 clears storage and redirects with expiry marker", async () => {
  const error = { config: { url: "/projects" }, response: { status: 401 } };
  await expect(rejectResponse(error)).rejects.toBe(error);
  expect(window.localStorage.removeItem).toHaveBeenCalledWith("token");
  expect(window.localStorage.removeItem).toHaveBeenCalledWith("user");
  expect(window.location.assign).toHaveBeenCalledWith("/login?expired=1");
});
test("a wrong-password 401 stays in the login form", async () => {
  const error = { config: { url: "/auth/login" }, response: { status: 401 } };
  await expect(rejectResponse(error)).rejects.toBe(error);
  expect(window.location.assign).not.toHaveBeenCalled();
  expect(window.localStorage.removeItem).not.toHaveBeenCalled();
});
