import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";
import { AuthProvider, useAuth } from "../src/context/AuthProvider";
import {
  colors,
  ErrorBanner,
  Loading,
  Screen,
  styles,
} from "../src/components/ui";

/** Mounts navigation only after restoring the server-verified session. */
function Navigator() {
  const { user, loading, error, retry } = useAuth();
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
          <ErrorBanner message={error} retry={retry} />
        </View>
      </Screen>
    );
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
    </Stack>
  );
}
/** Supplies secure auth and safe-area context to every route. */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <Navigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
