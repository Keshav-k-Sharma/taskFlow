import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import AuthScreen from "../src/screens/AuthScreen";
import { useAuth } from "../src/context/AuthProvider";
jest.mock("../src/context/AuthProvider", () => ({ useAuth: jest.fn() }));
const signIn = jest.fn();
beforeEach(() => {
  jest.clearAllMocks();
  useAuth.mockReturnValue({ signIn, message: "" });
});
test("invalid registration shows errors without making an auth request", async () => {
  await render(<AuthScreen registerMode />);
  await fireEvent.press(screen.getByRole("button", { name: "Create account" }));
  expect(await screen.findByText("Full name is required")).toBeTruthy();
  expect(signIn).not.toHaveBeenCalled();
});
test("valid login submits the same credentials as the web", async () => {
  signIn.mockResolvedValue({});
  await render(<AuthScreen />);
  await fireEvent.changeText(
    screen.getByLabelText("Email"),
    "user@example.com",
  );
  await fireEvent.changeText(screen.getByLabelText("Password"), "password123");
  await fireEvent.press(screen.getByRole("button", { name: "Log in" }));
  await waitFor(() =>
    expect(signIn).toHaveBeenCalledWith(
      { email: "user@example.com", password: "password123" },
      false,
    ),
  );
});
test("login network errors show a recoverable inline message", async () => {
  signIn.mockRejectedValue({ code: "ERR_NETWORK" });
  await render(<AuthScreen />);
  await fireEvent.changeText(
    screen.getByLabelText("Email"),
    "user@example.com",
  );
  await fireEvent.changeText(screen.getByLabelText("Password"), "password123");
  await fireEvent.press(screen.getByRole("button", { name: "Log in" }));
  expect(await screen.findByText("No internet connection")).toBeTruthy();
});
test("expired sessions show the login explanation", async () => {
  useAuth.mockReturnValue({
    signIn,
    message: "Session expired, please log in again.",
  });
  await render(<AuthScreen />);
  expect(
    screen.getByText("Session expired, please log in again."),
  ).toBeTruthy();
});
