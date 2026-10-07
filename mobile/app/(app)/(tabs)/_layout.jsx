import { Tabs } from "expo-router";
import { colors } from "../../../src/components/ui";
/** Provides four mobile sections with consistent dark-theme navigation. */
export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="dashboard"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.surface },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="projects" options={{ title: "Projects" }} />
      <Tabs.Screen name="tasks" options={{ title: "Tasks" }} />
      <Tabs.Screen name="settings" options={{ title: "Account" }} />
    </Tabs>
  );
}
