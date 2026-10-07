import ProtectedPage from "@/components/layout/ProtectedPage";
import TasksView from "@/components/tasks/TasksView";
/** Guards and displays tasks across owned projects. */
export default function TasksPage() {
  return (
    <ProtectedPage>
      <TasksView />
    </ProtectedPage>
  );
}
