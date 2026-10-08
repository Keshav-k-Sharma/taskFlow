import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import { router } from "expo-router";
import ProjectForm from "../src/components/ProjectForm";
import { createProject } from "../src/api/resources";
import { projectSchema, projectPayload } from "../src/utils/validators";

jest.mock("../src/api/resources", () => ({ createProject: jest.fn() }));
beforeEach(() => {
  jest.clearAllMocks();
  createProject.mockResolvedValue({});
});

test("creates a project with the shared payload and returns to projects", async () => {
  await render(<ProjectForm />);
  await fireEvent.changeText(screen.getByLabelText("Name"), " My project ");
  await fireEvent.press(screen.getByRole("button", { name: "Save project" }));
  await waitFor(() =>
    expect(createProject).toHaveBeenCalledWith({
      name: "My project",
      description: "",
      status: "NOT_STARTED",
      startDate: null,
      endDate: null,
    }),
  );
  expect(router.replace).toHaveBeenCalledWith("/projects");
});

test("rejects empty names without calling the API", async () => {
  await render(<ProjectForm />);
  await fireEvent.press(screen.getByRole("button", { name: "Save project" }));
  await waitFor(() =>
    expect(screen.getByText("Name is required")).toBeTruthy(),
  );
  expect(createProject).not.toHaveBeenCalled();
});

test("shows a save failure and keeps the entered project available for retry", async () => {
  createProject.mockRejectedValue(new Error("Network Error"));
  await render(<ProjectForm />);
  await fireEvent.changeText(screen.getByLabelText("Name"), "Retry project");
  await fireEvent.press(screen.getByRole("button", { name: "Save project" }));
  await waitFor(() => expect(screen.getByRole("alert")).toBeTruthy());
  expect(screen.getByLabelText("Name").props.value).toBe("Retry project");
  expect(router.replace).not.toHaveBeenCalled();
});

test("rejects reversed project dates and excludes ownership fields", () => {
  const values = {
    name: "Project",
    description: "",
    status: "NOT_STARTED",
    startDate: "2026-10-09",
    endDate: "2026-10-08",
  };
  expect(projectSchema.safeParse(values).success).toBe(false);
  expect(
    projectPayload({ ...values, ownerId: "another-user", id: "injected" }),
  ).not.toHaveProperty("ownerId");
  expect(projectPayload({ ...values, id: "injected" })).not.toHaveProperty(
    "id",
  );
});
