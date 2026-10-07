import { Alert } from "react-native";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import TaskList from "../src/components/TaskList";
import useResource from "../src/hooks/useResource";
import { deleteTask, updateTask } from "../src/api/resources";
jest.mock("../src/hooks/useResource", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("../src/api/resources", () => ({
  deleteTask: jest.fn(),
  updateTask: jest.fn(),
}));
const task = {
  id: "task",
  projectId: "project",
  name: "Test task",
  status: "PENDING",
  priority: "MEDIUM",
  dueDate: null,
};
const refresh = jest.fn();
beforeEach(() => {
  jest.clearAllMocks();
  useResource.mockReturnValue({
    data: { tasks: [task] },
    loading: false,
    error: "",
    refresh,
  });
});
test("mark complete sends only the status field and refreshes the list", async () => {
  updateTask.mockResolvedValue({});
  await render(<TaskList />);
  await fireEvent.press(screen.getByRole("button", { name: "Mark complete" }));
  await waitFor(() =>
    expect(updateTask).toHaveBeenCalledWith("task", { status: "COMPLETED" }),
  );
  expect(refresh).toHaveBeenCalled();
});
test("deletion requires the destructive confirmation", async () => {
  const alert = jest.spyOn(Alert, "alert").mockImplementation(() => {});
  deleteTask.mockResolvedValue({});
  await render(<TaskList />);
  await fireEvent.press(screen.getByRole("button", { name: "Delete" }));
  expect(deleteTask).not.toHaveBeenCalled();
  const buttons = alert.mock.calls[0][2];
  expect(buttons[0].style).toBe("cancel");
  await act(() => buttons[1].onPress());
  expect(deleteTask).toHaveBeenCalledWith("task");
  alert.mockRestore();
});
test("network failures expose Retry and can complete the original action", async () => {
  updateTask
    .mockRejectedValueOnce({ code: "ERR_NETWORK" })
    .mockResolvedValueOnce({});
  await render(<TaskList />);
  await fireEvent.press(screen.getByRole("button", { name: "Mark complete" }));
  expect(await screen.findByText("No internet connection")).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "Retry" }));
  await waitFor(() => expect(refresh).toHaveBeenCalled());
  expect(updateTask).toHaveBeenCalledTimes(2);
});
