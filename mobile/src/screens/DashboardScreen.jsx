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
  ["totalProjects", "Total Projects", "#e4ecff"],
  ["totalTasks", "Total Tasks", "#eae5ff"],
  ["completedTasks", "Completed Tasks", "#dff2e8"],
  ["pendingTasks", "Pending Tasks", "#ffedc8"],
  ["projectsInProgress", "Projects In Progress", "#deeff5"],
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
            {
              borderColor: "#315dec",
              backgroundColor: "#263bbf",
              padding: 24,
              overflow: "hidden",
            },
          ]}
        >
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              right: -45,
              top: -35,
              width: 160,
              height: 160,
              borderRadius: 80,
              borderWidth: 24,
              borderColor: "#4b63d2",
            }}
          />
          <Text
            style={[styles.badge, { color: "#e5ecff", letterSpacing: 1.8 }]}
          >
            YOUR WORKSPACE
          </Text>
          <Text style={[styles.title, { color: "#f5f7ff", fontSize: 28 }]}>
            Less busywork. More forward motion.
          </Text>
          <Text style={[styles.muted, { color: "#e5ecff" }]}>
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
              {stats.map(([key, title, tone]) => (
                <View
                  key={key}
                  style={[
                    styles.card,
                    {
                      width: "48%",
                      flexGrow: 1,
                      backgroundColor: tone,
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
