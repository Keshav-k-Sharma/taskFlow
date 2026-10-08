import { Text, View } from "react-native";
import { router } from "expo-router";
import useResource from "../hooks/useResource";
import TaskForm from "../components/TaskForm";
import { Button, ErrorBanner, Loading, Screen, styles } from "../components/ui";

/** Loads an existing task before mounting an edit form. */
function EditTask({ id, projects }) {
  const { data, loading, error, refresh } = useResource(`/tasks/${id}`);
  if (loading)
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  if (error)
    return (
      <Screen>
        <View style={styles.content}>
          <ErrorBanner message={error} retry={refresh} />
          <Button
            secondary
            title="Back to tasks"
            onPress={() => router.replace("/tasks")}
          />
        </View>
      </Screen>
    );
  return <TaskForm item={data.task} projects={projects} />;
}
/** Loads owned projects and handles create/edit task route parameters. */
export default function TaskFormScreen({ id, projectId }) {
  const { data, loading, error, refresh } = useResource("/projects");
  if (loading)
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  if (error)
    return (
      <Screen>
        <View style={styles.content}>
          <ErrorBanner message={error} retry={refresh} />
          <Button
            secondary
            title="Back to tasks"
            onPress={() => router.replace("/tasks")}
          />
        </View>
      </Screen>
    );
  if (!data.projects.length)
    return (
      <Screen>
        <View style={styles.content}>
          <Text style={styles.heading}>Create a project first.</Text>
          <Button
            title="Create project"
            onPress={() => router.push("/projects/form")}
          />
          <Button secondary title="Retry" onPress={refresh} />
          <Button
            secondary
            title="Back to tasks"
            onPress={() => router.replace("/tasks")}
          />
        </View>
      </Screen>
    );
  return id ? (
    <EditTask id={id} projects={data.projects} />
  ) : (
    <TaskForm projectId={projectId} projects={data.projects} />
  );
}
