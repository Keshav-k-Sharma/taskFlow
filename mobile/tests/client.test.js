import * as SecureStore from "expo-secure-store";
import {
  authorizeRequest,
  rejectResponse,
  onSessionExpired,
  errorMessage,
} from "../src/api/client";
beforeEach(() => {
  jest.clearAllMocks();
  SecureStore.getItemAsync.mockResolvedValue("current");
  SecureStore.deleteItemAsync.mockResolvedValue();
});
test("request headers use the token from SecureStore", async () => {
  const config = await authorizeRequest({ headers: {} });
  expect(config.headers.Authorization).toBe("Bearer current");
});
test("expired session clears SecureStore and notifies auth", async () => {
  const listener = jest.fn();
  const unsubscribe = onSessionExpired(listener);
  const error = {
    config: { url: "/tasks", headers: { Authorization: "Bearer current" } },
    response: { status: 401 },
  };
  await expect(rejectResponse(error)).rejects.toBe(error);
  expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
    "taskflow.accessToken",
  );
  expect(listener).toHaveBeenCalledTimes(1);
  unsubscribe();
});
test("invalid login credentials do not clear the session", async () => {
  const error = { config: { url: "/auth/login" }, response: { status: 401 } };
  await expect(rejectResponse(error)).rejects.toBe(error);
  expect(SecureStore.deleteItemAsync).not.toHaveBeenCalled();
});
test("an old request cannot clear a newer token", async () => {
  const error = {
    config: { url: "/tasks", headers: { Authorization: "Bearer old" } },
    response: { status: 401 },
  };
  await expect(rejectResponse(error)).rejects.toBe(error);
  expect(SecureStore.deleteItemAsync).not.toHaveBeenCalled();
});
test("network failures display airplane-mode guidance", () => {
  expect(errorMessage({ code: "ERR_NETWORK" })).toBe("No internet connection");
  expect(errorMessage({ code: "ECONNABORTED" })).toMatch(/timed out/);
});
