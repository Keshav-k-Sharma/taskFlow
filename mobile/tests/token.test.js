import * as SecureStore from "expo-secure-store";
import { getToken, setToken, clearToken } from "../src/storage/token";
beforeEach(() => jest.clearAllMocks());
test("tokens are read from SecureStore only", async () => {
  SecureStore.getItemAsync.mockResolvedValue("test-token");
  expect(await getToken()).toBe("test-token");
  expect(SecureStore.getItemAsync).toHaveBeenCalledWith("taskflow.accessToken");
});
test("tokens are saved and removed using the same secure key", async () => {
  await setToken("test-token");
  await clearToken();
  expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
    "taskflow.accessToken",
    "test-token",
  );
  expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
    "taskflow.accessToken",
  );
});
test("secure storage failures propagate to the session recovery flow", async () => {
  SecureStore.setItemAsync.mockRejectedValueOnce(
    new Error("Storage unavailable"),
  );
  await expect(setToken("test-token")).rejects.toThrow("Storage unavailable");
});
