import { test, expect, beforeEach } from "@jest/globals";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteDialog from "@/components/resources/DeleteDialog";
import { deleteResource } from "@/lib/resources";
jest.mock("@/lib/resources", () => ({ deleteResource: jest.fn() }));
beforeEach(() => {
  jest.clearAllMocks();
  /** Models native modal visibility for accessibility queries. */
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute("open", "");
  };
  /** Closes the simulated native dialog. */
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute("open");
  };
});
test("projects are deleted only after confirmation and warn about cascading tasks", async () => {
  deleteResource.mockResolvedValue({});
  const onDeleted = jest.fn();
  render(
    <DeleteDialog
      resource="projects"
      item={{ id: "project-id", name: "Project" }}
      onClose={jest.fn()}
      onDeleted={onDeleted}
    />,
  );
  expect(deleteResource).not.toHaveBeenCalled();
  expect(screen.getByText(/All tasks in this project/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Delete" }));
  await waitFor(() => expect(onDeleted).toHaveBeenCalled());
  expect(deleteResource).toHaveBeenCalledWith("projects", "project-id");
});
test("a failed deletion keeps the dialog open and does not report success", async () => {
  deleteResource.mockRejectedValue(new Error("Network"));
  const onDeleted = jest.fn();
  render(
    <DeleteDialog
      resource="tasks"
      item={{ id: "task-id", name: "Task" }}
      onClose={jest.fn()}
      onDeleted={onDeleted}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Delete" }));
  expect(await screen.findByRole("alert")).toBeInTheDocument();
  expect(onDeleted).not.toHaveBeenCalled();
  expect(screen.getByRole("dialog")).toBeInTheDocument();
});
