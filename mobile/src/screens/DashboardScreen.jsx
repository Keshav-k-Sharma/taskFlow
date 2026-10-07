import { RefreshControl, ScrollView, Text, View } from "react-native";
import useResource from "../hooks/useResource";
import { colors, ErrorBanner, Loading, Screen, styles } from "../components/ui";
const stats = [
  ["totalProjects", "Total Projects"],
  ["totalTasks", "Total Tasks"],
  ["completedTasks", "Completed Tasks"],
  ["pendingTasks", "Pending Tasks"],
  ["projectsInProgress", "Projects In Progress"],
];
/** Shows the same five dashboard statistics as the web, with pull-to-refresh. */
export default function DashboardScreen() {
  const { data, loading, error, refresh } = useResource("/dashboard");
  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor={colors.accent}
          />
        }
      >
        <Text style={styles.title}>Dashboard</Text>
        <ErrorBanner message={error} retry={refresh} />
        {loading && !data ? (
          <Loading />
        ) : (
          data &&
          stats.map(([key, title]) => (
            <View key={key} style={styles.card}>
              <Text style={styles.muted}>{title}</Text>
              <Text style={styles.title}>{data[key]}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}
