import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import { colors } from "../../../src/components/ui";
const tabSymbols = {
  dashboard: {
    ios: "square.grid.2x2.fill",
    android: "dashboard",
    web: "dashboard",
  },
  projects: { ios: "folder.fill", android: "folder", web: "folder" },
  tasks: { ios: "checklist", android: "checklist", web: "checklist" },
  settings: {
    ios: "person.crop.circle",
    android: "account_circle",
    web: "account_circle",
  },
};
/** Provides four mobile sections with consistent dark-theme navigation. */
export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveBackgroundColor: "#292719",
        tabBarLabelStyle: { fontWeight: "600" },
        tabBarIcon: ({ color, size }) => (
          <SymbolView
            name={tabSymbols[route.name]}
            tintColor={color}
            size={size}
          />
        ),
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="projects" options={{ title: "Projects" }} />
      <Tabs.Screen name="tasks" options={{ title: "Tasks" }} />
      <Tabs.Screen name="settings" options={{ title: "Account" }} />
    </Tabs>
  );
}
