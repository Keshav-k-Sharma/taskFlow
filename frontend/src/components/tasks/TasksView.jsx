"use client";
import { useState } from "react";
import Link from "next/link";
import useResource from "@/hooks/useResource";
import useDebounce from "@/hooks/useDebounce";
import { setTaskCompleted } from "@/lib/resources";
import { errorMessage } from "@/lib/api";
import {
  Button,
  Badge,
  Spinner,
  EmptyState,
  ErrorBanner,
  Toast,
} from "@/components/ui";
import ResourceForm from "@/components/resources/ResourceForm";
import DeleteDialog from "@/components/resources/DeleteDialog";
import Filters from "@/components/resources/Filters";
import KanbanBoard from "./KanbanBoard";

/** Lists all owned tasks or one project's tasks using the same filters. */
export default function TasksView({ projectId }) {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
  });
  const search = useDebounce(filters.search);
  const query = Object.fromEntries(
    Object.entries({
      projectId,
      search,
      status: filters.status,
      priority: filters.priority,
    }).filter(([, value]) => value),
  );
  const tasks = useResource("/tasks", query);
  const projects = useResource("/projects");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  /** Refreshes the task list after a successful change. */
  function changed(message) {
    setEditing(null);
    setDeleting(null);
    setNotice(message);
    tasks.refresh();
  }
  /** Updates completion using PUT rather than the retired PATCH route. */
  async function complete(task) {
    setBusyId(task.id);
    setActionError("");
    try {
      await setTaskCompleted(task);
      changed("Task status updated.");
    } catch (failure) {
      setActionError(errorMessage(failure));
    } finally {
      setBusyId(null);
    }
  }
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h1 className={`${projectId ? "text-2xl" : "text-3xl"} font-bold`}>
          Tasks
        </h1>
        <Button
          disabled={
            projects.loading ||
            !!projects.error ||
            !projects.data?.projects.length
          }
          onClick={() => setEditing({})}
        >
          Create task
        </Button>
      </div>
      <Toast message={notice} />
      <ErrorBanner message={projects.error} retry={projects.refresh} />
      {!projects.loading &&
        !projects.error &&
        !projects.data?.projects.length && (
          <p className="text-sm text-muted">
            <Link href="/projects" className="text-accent underline">
              Create a project
            </Link>{" "}
            before adding tasks.
          </p>
        )}
      <Filters tasks filters={filters} onChange={setFilters} />
      <ErrorBanner message={tasks.error} retry={tasks.refresh} />
      <ErrorBanner message={actionError} />
      {tasks.loading ? (
        <Spinner />
      ) : (
        !tasks.error &&
        (tasks.data?.tasks.length ? (
          <KanbanBoard
            tasks={tasks.data.tasks}
            renderTask={(task) => (
              <article
                key={task.id}
                className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4"
              >
                <div className="min-w-0 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge value={task.status} />
                    <Badge value={task.priority} />
                  </div>
                  <h2 className="break-words text-lg font-semibold">
                    {task.name}
                  </h2>
                  <p className="break-words text-sm text-muted">
                    {task.description || "No description"}
                  </p>
                  <p className="text-xs text-muted">
                    Due: {task.dueDate?.slice(0, 10) || "No due date"}
                    {!projectId && (
                      <>
                        {" "}
                        ·{" "}
                        <Link
                          className="text-accent"
                          href={`/projects/${task.projectId}`}
                        >
                          {projects.data?.projects.find(
                            (project) => project.id === task.projectId,
                          )?.name || "View project"}
                        </Link>
                      </>
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap items-start gap-2">
                  <Button
                    variant={
                      task.status === "COMPLETED" ? "warning" : "success"
                    }
                    disabled={!!busyId}
                    onClick={() => complete(task)}
                  >
                    {busyId === task.id
                      ? "Saving…"
                      : task.status === "COMPLETED"
                        ? "Mark pending"
                        : "Mark complete"}
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={!!busyId || projects.loading}
                    onClick={() => setEditing(task)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    disabled={!!busyId}
                    onClick={() => setDeleting(task)}
                  >
                    Delete
                  </Button>
                </div>
              </article>
            )}
          />
        ) : (
          <EmptyState
            title={
              search || filters.status || filters.priority
                ? "No matching tasks"
                : "No tasks yet"
            }
          >
            Create a task or adjust your filters.
          </EmptyState>
        ))
      )}
      {editing && (
        <ResourceForm
          resource="tasks"
          item={editing.id ? editing : null}
          projects={projects.data?.projects || []}
          projectId={projectId}
          onClose={() => setEditing(null)}
          onSaved={() => changed("Task saved.")}
        />
      )}
      {deleting && (
        <DeleteDialog
          resource="tasks"
          item={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={() => changed("Task deleted.")}
        />
      )}
    </section>
  );
}
