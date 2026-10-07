import { useState } from "react";
import { ScrollView, Text } from "react-native";
import { useAuth } from "../context/AuthProvider";
import { errorMessage } from "../api/client";
import { Button, ErrorBanner, Screen, styles } from "../components/ui";
/** Shows the signed-in profile and revokes its token on logout. */
export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  /** Logs out while keeping a failed server request recoverable. */
  async function logout() {
    setBusy(true);
    setError("");
    try {
      await signOut();
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Account</Text>
        <Text style={styles.heading}>{user.fullName}</Text>
        <Text style={styles.muted}>{user.email}</Text>
        <ErrorBanner message={error} />
        <Button
          title={busy ? "Logging out…" : "Logout"}
          disabled={busy}
          onPress={logout}
        />
      </ScrollView>
    </Screen>
  );
}
