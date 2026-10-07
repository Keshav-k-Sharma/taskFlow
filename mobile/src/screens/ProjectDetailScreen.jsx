import { Text, View } from "react-native";
import { router } from "expo-router";
import useResource from "../hooks/useResource";
import TaskList from "../components/TaskList";
import { Button, ErrorBanner, Loading, Screen, styles } from "../components/ui";
import { label } from "../utils/validators";

/** Shows project metadata and its searchable task list. */
export default function ProjectDetailScreen({ id }) {
  const { data, loading, error, refresh } = useResource(`/projects/${id}`);
  const back = (
    <Button
      secondary
      title="Back to projects"
      onPress={() => router.replace("/projects")}
    />
  );
  if (loading && !data)
    return (
      <Screen>
        {back}
        <Loading />
      </Screen>
    );
  if (error)
    return (
      <Screen>
        <View style={styles.content}>
          {back}
          <ErrorBanner message={error} retry={refresh} />
        </View>
      </Screen>
    );
  const project = data.project;
  return (
    <Screen>
      <TaskList
        projectId={id}
        header={
          <View style={styles.card}>
            {back}
            <Text style={styles.heading}>{project.name}</Text>
            <Text style={styles.badge}>{label(project.status)}</Text>
            <Text style={styles.muted}>
              {project.description || "No description"}
            </Text>
            <Text style={styles.muted}>
              Start: {project.startDate?.slice(0, 10) || "Not set"} · End:{" "}
              {project.endDate?.slice(0, 10) || "Not set"}
            </Text>
            <Button
              secondary
              title={loading ? "Refreshing…" : "Refresh project"}
              disabled={loading}
              onPress={refresh}
            />
          </View>
        }
      />
    </Screen>
  );
}
