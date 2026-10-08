import { RefreshControl, ScrollView, Text, View } from "react-native";
import useResource from "../hooks/useResource";
import {
  colors,
  Button,
  ErrorBanner,
  Loading,
  Screen,
  styles,
} from "../components/ui";
import { router } from "expo-router";
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
        <View
          style={[
            styles.card,
            { borderColor: "#debca4", backgroundColor: "#f8e5d1" },
          ]}
        >
          <Text style={styles.badge}>YOUR WORKSPACE</Text>
          <Text style={styles.heading}>Make room for progress.</Text>
          <Text style={styles.muted}>
            Organize a project, choose your next task, and keep moving.
          </Text>
          <Button
            title="Create project"
            onPress={() => router.push("/projects/form")}
          />
        </View>
        <ErrorBanner message={error} retry={refresh} />
        {loading && !data ? (
          <Loading />
        ) : (
          data && (
            <View style={[styles.row, { alignItems: "stretch" }]}>
              {stats.map(([key, title]) => (
                <View
                  key={key}
                  style={[
                    styles.card,
                    {
                      width: "48%",
                      flexGrow: 1,
                      borderTopColor:
                        key === "completedTasks"
                          ? colors.success
                          : colors.accent,
                      borderTopWidth: 3,
                    },
                  ]}
                >
                  <Text style={styles.muted}>{title}</Text>
                  <Text style={styles.title}>{data[key]}</Text>
                </View>
              ))}
            </View>
          )
        )}
      </ScrollView>
    </Screen>
  );
}
