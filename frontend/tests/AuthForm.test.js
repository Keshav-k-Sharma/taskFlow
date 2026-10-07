import { test, expect, beforeEach } from "@jest/globals";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthForm from "@/components/auth/AuthForm";
import api from "@/lib/api";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";

jest.mock("@/lib/api", () => ({
  __esModule: true,
  default: { post: jest.fn() },
  errorMessage: (error) => error.message,
}));
jest.mock("@/components/auth/AuthProvider", () => ({ useAuth: jest.fn() }));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));
const replace = jest.fn();
const signIn = jest.fn();
beforeEach(() => {
  jest.clearAllMocks();
  useRouter.mockReturnValue({ replace });
  useSearchParams.mockReturnValue(new URLSearchParams());
  useAuth.mockReturnValue({ signIn });
});
test("invalid registration shows inline errors and sends no request", async () => {
  render(<AuthForm registerMode />);
  fireEvent.click(screen.getByRole("button", { name: "Create account" }));
  expect(await screen.findByText("Full name is required")).toBeInTheDocument();
  expect(api.post).not.toHaveBeenCalled();
});
test("successful login stores the session and navigates to dashboard", async () => {
  const data = { token: "test-token", user: { fullName: "User" } };
  api.post.mockResolvedValue({ data });
  render(<AuthForm />);
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "user@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "password123" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Log in" }));
  await waitFor(() => expect(signIn).toHaveBeenCalledWith(data));
  expect(api.post).toHaveBeenCalledWith("/auth/login", {
    email: "user@example.com",
    password: "password123",
  });
  expect(replace).toHaveBeenCalledWith("/dashboard");
});
test("login failures stay visible and preserve the form", async () => {
  api.post.mockRejectedValue(new Error("Invalid email or password"));
  render(<AuthForm />);
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "user@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "wrong" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Log in" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Invalid email or password",
  );
  expect(replace).not.toHaveBeenCalled();
});
test("expired sessions display a clear login banner", () => {
  useSearchParams.mockReturnValue(new URLSearchParams("expired=1"));
  render(<AuthForm />);
  expect(
    screen.getByText("Session expired, please log in again."),
  ).toBeInTheDocument();
});
