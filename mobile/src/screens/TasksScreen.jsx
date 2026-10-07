import TaskList from "../components/TaskList";
import { Screen } from "../components/ui";
/** Shows tasks across every owned project. */
export default function TasksScreen() {
  return (
    <Screen>
      <TaskList />
    </Screen>
  );
}
