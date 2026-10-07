import { act, renderHook, waitFor } from "@testing-library/react-native";
import { AuthProvider, useAuth } from "../src/context/AuthProvider";
import client, { onSessionExpired } from "../src/api/client";
import { getToken, setToken, clearToken } from "../src/storage/token";
jest.mock("../src/api/client", () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
  onSessionExpired: jest.fn(() => jest.fn()),
  errorMessage: () => "No internet connection",
}));
jest.mock("../src/storage/token", () => ({
  getToken: jest.fn(),
  setToken: jest.fn(),
  clearToken: jest.fn(),
}));
beforeEach(() => {
  jest.clearAllMocks();
  getToken.mockResolvedValue(null);
});
test("startup verifies the SecureStore token with the shared auth/me endpoint", async () => {
  getToken.mockResolvedValue("token");
  client.get.mockResolvedValue({
    data: { user: { id: "user", fullName: "User" } },
  });
  const { result } = await renderHook(() => useAuth(), {
    wrapper: AuthProvider,
  });
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(client.get).toHaveBeenCalledWith("/auth/me");
  expect(result.current.user.fullName).toBe("User");
});
test("a startup network failure retains the token and allows retry", async () => {
  getToken.mockResolvedValue("token");
  client.get
    .mockRejectedValueOnce({ code: "ERR_NETWORK" })
    .mockResolvedValueOnce({ data: { user: { id: "user" } } });
  const { result } = await renderHook(() => useAuth(), {
    wrapper: AuthProvider,
  });
  await waitFor(() =>
    expect(result.current.error).toBe("No internet connection"),
  );
  expect(clearToken).not.toHaveBeenCalled();
  await act(() => result.current.retry());
  await waitFor(() => expect(result.current.user.id).toBe("user"));
});
test("session expiry clears the in-memory user and explains the login redirect", async () => {
  getToken.mockResolvedValue("token");
  client.get.mockResolvedValue({ data: { user: { id: "user" } } });
  const { result } = await renderHook(() => useAuth(), {
    wrapper: AuthProvider,
  });
  await waitFor(() => expect(result.current.user).toBeTruthy());
  await act(() => onSessionExpired.mock.calls[0][0]());
  expect(result.current.user).toBeNull();
  expect(result.current.message).toBe("Session expired, please log in again.");
});
test("login unlocks screens only after persisting the token securely", async () => {
  const { result } = await renderHook(() => useAuth(), {
    wrapper: AuthProvider,
  });
  client.post.mockResolvedValue({
    data: { token: "new-token", user: { id: "user" } },
  });
  await act(() =>
    result.current.signIn({
      email: "user@example.com",
      password: "password123",
    }),
  );
  expect(setToken).toHaveBeenCalledWith("new-token");
  expect(result.current.user.id).toBe("user");
});
test("logout does not remove the secure token if server revocation fails", async () => {
  const { result } = await renderHook(() => useAuth(), {
    wrapper: AuthProvider,
  });
  client.post.mockRejectedValueOnce(new Error("Offline"));
  await act(async () => {
    await expect(result.current.signOut()).rejects.toThrow("Offline");
  });
  expect(clearToken).not.toHaveBeenCalled();
  client.post.mockResolvedValueOnce({});
  await act(() => result.current.signOut());
  expect(client.post).toHaveBeenCalledWith("/auth/logout");
  expect(clearToken).toHaveBeenCalled();
});
