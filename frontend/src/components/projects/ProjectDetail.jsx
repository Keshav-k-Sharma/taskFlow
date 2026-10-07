"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useResource from "@/hooks/useResource";
import TasksView from "@/components/tasks/TasksView";
import { Badge, Button, Spinner, ErrorBanner, Toast } from "@/components/ui";
import ResourceForm from "@/components/resources/ResourceForm";
import DeleteDialog from "@/components/resources/DeleteDialog";

/** Shows project metadata and its filtered task list. */
export default function ProjectDetail({ id }) {
  const { data, loading, error, refresh } = useResource(`/projects/${id}`);
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState("");
  if (loading) return <Spinner />;
  if (error)
    return (
      <>
        <Link href="/projects" className="text-yellow-300">
          ← Projects
        </Link>
        <ErrorBanner message={error} retry={refresh} />
      </>
    );
  const project = data.project;
  return (
    <>
      <Link href="/projects" className="text-sm text-yellow-300">
        ← Projects
      </Link>
      <Toast message={notice} />
      <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <Badge value={project.status} />
        <h1 className="break-words text-3xl font-bold">{project.name}</h1>
        <p className="whitespace-pre-wrap break-words text-zinc-400">
          {project.description || "No description"}
        </p>
        <p className="text-sm text-zinc-500">
          Start: {project.startDate?.slice(0, 10) || "Not set"} · End:{" "}
          {project.endDate?.slice(0, 10) || "Not set"}
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setEditing(true)}>
            Edit project
          </Button>
          <Button variant="danger" onClick={() => setDeleting(true)}>
            Delete project
          </Button>
        </div>
      </section>
      <TasksView projectId={id} />
      {editing && (
        <ResourceForm
          resource="projects"
          item={project}
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            setNotice("Project saved.");
            refresh();
          }}
        />
      )}
      {deleting && (
        <DeleteDialog
          resource="projects"
          item={project}
          onClose={() => setDeleting(false)}
          onDeleted={() => router.replace("/projects")}
        />
      )}
    </>
  );
}
