import { useLocalSearchParams } from "expo-router";
import TaskFormScreen from "../../../src/screens/TaskFormScreen";
/** Resolves task create/edit parameters. */
export default function TaskFormRoute() {
  const { id, projectId } = useLocalSearchParams();
  return <TaskFormScreen id={id} projectId={projectId} />;
}
