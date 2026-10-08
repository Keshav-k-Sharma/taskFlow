"use client";
import Link from "next/link";
import useResource from "@/hooks/useResource";
import { Spinner, ErrorBanner, Button } from "@/components/ui";

const stats = [
  ["totalProjects", "Total Projects", "stat-projects"],
  ["totalTasks", "Total Tasks", "stat-tasks"],
  ["completedTasks", "Completed Tasks", "stat-completed"],
  ["pendingTasks", "Pending Tasks", "stat-pending"],
  ["projectsInProgress", "Projects In Progress", "stat-progress"],
];
/** Displays the five server-calculated, user-scoped statistics. */
export default function DashboardView() {
  const { data, loading, error, refresh } = useResource("/dashboard");
  return (
    <>
      <div className="flex justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Your workspace at a glance</p>
          <h1 className="mt-1 text-3xl font-bold">Dashboard</h1>
        </div>
        <Button variant="secondary" disabled={loading} onClick={refresh}>
          Refresh
        </Button>
      </div>
      <section className="workspace-hero">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em]">
          Your next big idea starts here
        </p>
        <h2>
          Less busywork.
          <br />
          More forward motion.
        </h2>
        <p className="mt-4 text-sm sm:text-base">
          Bring projects into focus, keep your priorities clear, and turn plans
          into progress.
        </p>
        <Link href="/projects">Explore your projects →</Link>
      </section>
      <ErrorBanner message={error} retry={refresh} />
      {loading ? (
        <Spinner />
      ) : (
        !error && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map(([key, title, tone]) => (
              <article
                key={key}
                className={`surface-card rounded-2xl border border-line p-6 ${tone}`}
              >
                <h2 className="text-sm text-muted">{title}</h2>
                <p className="mt-3 text-4xl font-bold text-accent">
                  {data[key]}
                </p>
              </article>
            ))}
          </div>
        )
      )}
      <div className="flex gap-5 text-sm text-accent">
        <Link href="/projects">Manage projects →</Link>
        <Link href="/tasks">Manage tasks →</Link>
      </div>
    </>
  );
}
