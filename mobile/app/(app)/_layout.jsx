import { Stack } from "expo-router";
/** Groups the authenticated tabs and detail/form screens. */
export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="projects/[id]" />
      <Stack.Screen name="tasks/form" />
    </Stack>
  );
}
