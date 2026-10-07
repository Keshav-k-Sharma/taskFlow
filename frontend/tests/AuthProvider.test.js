import { test, expect, beforeEach } from "@jest/globals";
import { renderHook, waitFor, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import api from "@/lib/api";
jest.mock("@/lib/api", () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));
beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});
test("startup validates a stored token through auth/me", async () => {
  localStorage.setItem("token", "token");
  api.get.mockResolvedValue({
    data: { user: { id: "user", fullName: "User" } },
  });
  const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(api.get).toHaveBeenCalledWith("/auth/me");
  expect(result.current.user.fullName).toBe("User");
});
test("logout preserves the token on network failure and clears it after revocation", async () => {
  const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
  await waitFor(() => expect(result.current.loading).toBe(false));
  act(() =>
    result.current.signIn({ token: "token", user: { fullName: "User" } }),
  );
  api.post.mockRejectedValueOnce(new Error("Network"));
  await act(async () => {
    await expect(result.current.signOut()).rejects.toThrow("Network");
  });
  expect(localStorage.getItem("token")).toBe("token");
  api.post.mockResolvedValueOnce({});
  await act(async () => result.current.signOut());
  expect(api.post).toHaveBeenCalledWith("/auth/logout");
  expect(localStorage.getItem("token")).toBeNull();
  expect(result.current.user).toBeNull();
});
