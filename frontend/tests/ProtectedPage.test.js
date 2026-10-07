import { test, expect, beforeEach } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import ProtectedPage from "@/components/layout/ProtectedPage";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
jest.mock("@/components/auth/AuthProvider", () => ({ useAuth: jest.fn() }));
jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));
jest.mock("@/components/layout/Navbar", () => ({
  __esModule: true,
  default: () => <nav>Navigation</nav>,
}));
const replace = jest.fn();
beforeEach(() => {
  jest.clearAllMocks();
  useRouter.mockReturnValue({ replace });
});
test("protected children stay hidden while the session is loading", () => {
  useAuth.mockReturnValue({ user: null, loading: true, error: "" });
  render(
    <ProtectedPage>
      <p>Private tasks</p>
    </ProtectedPage>,
  );
  expect(screen.queryByText("Private tasks")).not.toBeInTheDocument();
  expect(replace).not.toHaveBeenCalled();
});
test("unauthenticated sessions redirect without mounting data views", async () => {
  useAuth.mockReturnValue({ user: null, loading: false, error: "" });
  render(
    <ProtectedPage>
      <p>Private tasks</p>
    </ProtectedPage>,
  );
  await waitFor(() => expect(replace).toHaveBeenCalledWith("/login"));
  expect(screen.queryByText("Private tasks")).not.toBeInTheDocument();
});
test("network errors allow retry instead of losing the session", () => {
  useAuth.mockReturnValue({
    user: null,
    loading: false,
    error: "Retry verification",
    retry: jest.fn(),
  });
  render(
    <ProtectedPage>
      <p>Private tasks</p>
    </ProtectedPage>,
  );
  expect(screen.getByRole("alert")).toHaveTextContent("Retry verification");
  expect(replace).not.toHaveBeenCalled();
});
