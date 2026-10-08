import { TASK_STATUSES, label } from "@/lib/validators";

const tones = {
  PENDING: "border-honey",
  IN_PROGRESS: "border-dusty-blue",
  COMPLETED: "border-sage",
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
            className={`min-w-0 rounded-2xl border-t-4 ${tones[status]} bg-surface/50 p-3`}
          >
            <div className="mb-4 flex items-center justify-between px-2 py-2">
              <h2 className="text-sm font-semibold">{label(status)}</h2>
              <span className="rounded-full bg-sand px-2.5 py-1 text-xs text-ink">
                {items.length}
              </span>
            </div>
            <div className="space-y-3">{items.map(renderTask)}</div>
            {!items.length && (
              <p className="rounded-xl border border-dashed border-line p-5 text-sm text-muted">
                No tasks in this column
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}
