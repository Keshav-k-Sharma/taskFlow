"use client";
import Link from "next/link";
import useResource from "@/hooks/useResource";
import { Spinner, ErrorBanner, Button } from "@/components/ui";

const stats = [
  ["totalProjects", "Total Projects"],
  ["totalTasks", "Total Tasks"],
  ["completedTasks", "Completed Tasks"],
  ["pendingTasks", "Pending Tasks"],
  ["projectsInProgress", "Projects In Progress"],
];
/** Displays the five server-calculated, user-scoped statistics. */
export default function DashboardView() {
  const { data, loading, error, refresh } = useResource("/dashboard");
  return (
    <>
      <div className="flex justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-400">Your workspace at a glance</p>
          <h1 className="mt-1 text-3xl font-bold">Dashboard</h1>
        </div>
        <Button variant="secondary" disabled={loading} onClick={refresh}>
          Refresh
        </Button>
      </div>
      <ErrorBanner message={error} retry={refresh} />
      {loading ? (
        <Spinner />
      ) : (
        !error && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map(([key, title]) => (
              <article
                key={key}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
              >
                <h2 className="text-sm text-zinc-400">{title}</h2>
                <p className="mt-3 text-4xl font-bold text-yellow-300">
                  {data[key]}
                </p>
              </article>
            ))}
          </div>
        )
      )}
      <div className="flex gap-5 text-sm text-yellow-300">
        <Link href="/projects">Manage projects →</Link>
        <Link href="/tasks">Manage tasks →</Link>
      </div>
    </>
  );
}
