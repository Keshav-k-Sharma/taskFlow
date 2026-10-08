import { TASK_STATUSES, label } from "@/lib/validators";

const tones = {
  PENDING: "border-amber-400",
  IN_PROGRESS: "border-sky-400",
  COMPLETED: "border-emerald-400",
};
/** Groups the currently filtered tasks into accessible status columns. */
export default function KanbanBoard({ tasks, renderTask }) {
  return (
    <div className="grid items-start gap-5 lg:grid-cols-3">
      {TASK_STATUSES.map((status) => {
        const items = tasks.filter((task) => task.status === status);
        return (
          <section
            key={status}
            aria-label={`${label(status)} column`}
            className={`min-w-0 rounded-2xl border-t-4 ${tones[status]} bg-zinc-900/50 p-3`}
          >
            <div className="mb-4 flex items-center justify-between px-2 py-2">
              <h2 className="text-sm font-semibold">{label(status)}</h2>
              <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
                {items.length}
              </span>
            </div>
            <div className="space-y-3">{items.map(renderTask)}</div>
            {!items.length && (
              <p className="rounded-xl border border-dashed border-zinc-700 p-5 text-sm text-zinc-500">
                No tasks in this column
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}
