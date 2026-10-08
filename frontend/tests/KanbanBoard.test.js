import { render, screen, within } from "@testing-library/react";
import KanbanBoard from "@/components/tasks/KanbanBoard";

test("groups tasks by status and keeps all three columns visible", () => {
  render(
    <KanbanBoard
      tasks={[{ id: "1", name: "Review", status: "IN_PROGRESS" }]}
      renderTask={(task) => <p key={task.id}>{task.name}</p>}
    />,
  );
  expect(
    within(
      screen.getByRole("region", { name: "In Progress column" }),
    ).getByText("Review"),
  ).toBeInTheDocument();
  expect(
    within(screen.getByRole("region", { name: "Pending column" })).queryByText(
      "Review",
    ),
  ).not.toBeInTheDocument();
  expect(screen.getAllByText("No tasks in this column")).toHaveLength(2);
});
