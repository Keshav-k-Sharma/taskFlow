import api from "@/lib/api";
import { saveResource } from "@/lib/resources";
jest.mock("@/lib/api", () => ({
  __esModule: true,
  default: { post: jest.fn(), put: jest.fn() },
}));

beforeEach(() => jest.clearAllMocks());

test("task creation sends the selected project", async () => {
  await saveResource("tasks", { name: "Demo", projectId: "project" });
  expect(api.post).toHaveBeenCalledWith("/tasks", {
    name: "Demo",
    projectId: "project",
  });
});
test("task editing omits immutable projectId without mutating form data", async () => {
  const data = { name: "Updated", projectId: "project", dueDate: null };
  await saveResource("tasks", data, "task");
  expect(api.put).toHaveBeenCalledWith("/tasks/task", {
    name: "Updated",
    dueDate: null,
  });
  expect(data.projectId).toBe("project");
});
test("project editing keeps its writable date fields", async () => {
  await saveResource("projects", { name: "Updated", endDate: null }, "project");
  expect(api.put).toHaveBeenCalledWith("/projects/project", {
    name: "Updated",
    endDate: null,
  });
});
