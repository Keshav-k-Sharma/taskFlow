import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import TaskForm from "../src/components/TaskForm";
import { saveTask } from "../src/api/resources";
jest.mock("../src/api/resources", () => ({ saveTask: jest.fn() }));
const project = { id: "70bd45bb-8e2a-443b-ade8-97b0a372a560", name: "Project" };
beforeEach(() => {
  jest.clearAllMocks();
  saveTask.mockResolvedValue({});
});
test("a task with no due date uses the shared create payload", async () => {
  await render(<TaskForm projectId={project.id} projects={[project]} />);
  await fireEvent.changeText(screen.getByLabelText("Name"), "New task");
  await fireEvent.press(screen.getByRole("button", { name: "Save task" }));
  await waitFor(() =>
    expect(saveTask).toHaveBeenCalledWith(
      {
        name: "New task",
        description: "",
        status: "PENDING",
        priority: "MEDIUM",
        dueDate: null,
        projectId: project.id,
      },
      undefined,
    ),
  );
});
test("editing a task preserves enums and omits the projectId field", async () => {
  const item = {
    id: "task-id",
    projectId: project.id,
    name: "Existing",
    priority: "HIGH",
    status: "IN_PROGRESS",
    dueDate: null,
  };
  await render(<TaskForm item={item} projects={[project]} />);
  await fireEvent.press(screen.getByRole("button", { name: "Save task" }));
  await waitFor(() =>
    expect(saveTask).toHaveBeenCalledWith(
      {
        name: "Existing",
        description: "",
        status: "IN_PROGRESS",
        priority: "HIGH",
        dueDate: null,
      },
      "task-id",
    ),
  );
});
