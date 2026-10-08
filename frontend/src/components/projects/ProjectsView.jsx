"use client";
import { useState } from "react";
import Link from "next/link";
import useResource from "@/hooks/useResource";
import useDebounce from "@/hooks/useDebounce";
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

/** Lists owned projects with server search and create/edit/delete dialogs. */
export default function ProjectsView() {
  const [filters, setFilters] = useState({ search: "", status: "" });
  const search = useDebounce(filters.search);
  const { data, loading, error, refresh } = useResource("/projects", {
    ...(search && { search }),
    ...(filters.status && { status: filters.status }),
  });
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [notice, setNotice] = useState("");
  /** Refreshes project cards after a confirmed change. */
  function changed(message) {
    setEditing(null);
    setDeleting(null);
    setNotice(message);
    refresh();
  }
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Your workspace</p>
          <h1 className="mt-1 text-3xl font-bold">Projects</h1>
        </div>
        <Button onClick={() => setEditing({})}>Create project</Button>
      </div>
      <Toast message={notice} />
      <Filters filters={filters} onChange={setFilters} />
      <ErrorBanner message={error} retry={refresh} />
      {loading ? (
        <Spinner />
      ) : (
        !error &&
        (data?.projects.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.projects.map((project) => (
              <article
                key={project.id}
                className="flex flex-col gap-4 rounded-2xl border border-line border-t-accent/30 bg-surface p-6"
              >
                <Badge value={project.status} />
                <Link
                  href={`/projects/${project.id}`}
                  className="break-words text-lg font-semibold hover:text-accent"
                >
                  {project.name}
                </Link>
                <p className="flex-1 break-words text-sm text-muted">
                  {project.description || "No description"}
                </p>
                <p className="text-xs text-muted">
                  {project.startDate?.slice(0, 10) || "No start date"} →{" "}
                  {project.endDate?.slice(0, 10) || "No end date"}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setEditing(project)}
                  >
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => setDeleting(project)}>
                    Delete
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title={
              filters.search || filters.status
                ? "No matching projects"
                : "No projects yet"
            }
          >
            Create a project to start organising your tasks.
          </EmptyState>
        ))
      )}
      {editing && (
        <ResourceForm
          resource="projects"
          item={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSaved={() => changed("Project saved.")}
        />
      )}
      {deleting && (
        <DeleteDialog
          resource="projects"
          item={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={() => changed("Project deleted.")}
        />
      )}
    </>
  );
}
