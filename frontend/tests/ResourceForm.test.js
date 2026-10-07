import { test, expect, beforeEach } from "@jest/globals";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResourceForm from "@/components/resources/ResourceForm";
import { saveResource } from "@/lib/resources";
jest.mock("@/lib/resources", () => ({ saveResource: jest.fn() }));
const project = { id: "70bd45bb-8e2a-443b-ade8-97b0a372a560", name: "Project" };
beforeEach(() => {
  jest.clearAllMocks();
  /** Models native dialog visibility in jsdom. */
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute("open", "");
  };
  /** Models native dialog closure in jsdom. */
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute("open");
  };
  saveResource.mockResolvedValue({});
});
test("creates a task inside a fixed project with nullable due date", async () => {
  const onSaved = jest.fn();
  render(
    <ResourceForm
      resource="tasks"
      item={{}}
      projectId={project.id}
      projects={[project]}
      onClose={jest.fn()}
      onSaved={onSaved}
    />,
  );
  expect(
    screen.getByRole("heading", { name: "Create task" }),
  ).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Name"), {
    target: { value: "New task" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save" }));
  await waitFor(() => expect(onSaved).toHaveBeenCalled());
  expect(saveResource).toHaveBeenCalledWith(
    "tasks",
    {
      name: "New task",
      description: "",
      projectId: project.id,
      status: "PENDING",
      priority: "MEDIUM",
      dueDate: null,
    },
    undefined,
  );
});
test("new task placeholder keeps project selection enabled", () => {
  render(
    <ResourceForm
      resource="tasks"
      item={{}}
      projects={[project]}
      onClose={jest.fn()}
      onSaved={jest.fn()}
    />,
  );
  expect(screen.getByLabelText("Project")).not.toBeDisabled();
});

test("editing a task sends no projectId and preserves its status", async () => {
  const item = {
    id: "task-id",
    projectId: project.id,
    name: "Existing",
    status: "IN_PROGRESS",
    priority: "HIGH",
    dueDate: null,
  };
  render(
    <ResourceForm
      resource="tasks"
      item={item}
      projects={[project]}
      onClose={jest.fn()}
      onSaved={jest.fn()}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Save" }));
  await waitFor(() => expect(saveResource).toHaveBeenCalled());
  expect(saveResource.mock.calls[0][1]).toEqual({
    name: "Existing",
    description: "",
    status: "IN_PROGRESS",
    priority: "HIGH",
    dueDate: null,
  });
});
