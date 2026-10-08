import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";

export const colors = {
  background: "#0b1020",
  surface: "#161e32",
  border: "#2b3650",
  text: "#fafafa",
  muted: "#a1a1aa",
  accent: "#fde047",
  danger: "#fca5a5",
  success: "#86efac",
  warning: "#fcd34d",
  info: "#7dd3fc",
};
export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 16, flexGrow: 1 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 16,
    gap: 12,
    marginBottom: 12,
  },
  title: { color: colors.text, fontSize: 28, fontWeight: "700" },
  heading: { color: colors.text, fontSize: 20, fontWeight: "600" },
  text: { color: colors.text, fontSize: 16 },
  muted: { color: colors.muted, fontSize: 14 },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
  },
  field: { gap: 8 },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    color: colors.text,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    minHeight: 48,
    borderRadius: 8,
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  successButton: {
    backgroundColor: "#123b32",
    borderColor: "#27634e",
    borderWidth: 1,
  },
  dangerButton: {
    backgroundColor: "#421f2a",
    borderColor: "#713344",
    borderWidth: 1,
  },
  warningButton: {
    backgroundColor: "#3d321e",
    borderColor: "#6c562a",
    borderWidth: 1,
  },
  pill: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#243047",
  },
  disabled: { opacity: 0.5 },
  buttonText: { color: colors.background, fontSize: 15, fontWeight: "700" },
  secondaryText: { color: colors.text },
  error: { color: colors.danger, fontSize: 14 },
  banner: { padding: 12, backgroundColor: "#422006", gap: 8 },
  badge: { color: colors.accent, fontSize: 13 },
});

/** Provides safe areas and a persistent airplane-mode banner. */
export function Screen({ children }) {
  const network = useNetInfo();
  const offline =
    network.isConnected === false || network.isInternetReachable === false;
  return (
    <SafeAreaView style={styles.screen}>
      {offline && (
        <View style={styles.banner} accessibilityLiveRegion="polite">
          <Text style={styles.text}>No internet connection</Text>
          <Button
            secondary
            title="Retry connection"
            onPress={() => NetInfo.refresh()}
          />
        </View>
      )}
      {children}
    </SafeAreaView>
  );
}
/** Renders a touch-friendly action with explicit disabled state. */
export function Button({
  title,
  onPress,
  disabled = false,
  secondary = false,
  danger = false,
  success = false,
  warning = false,
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        secondary && styles.secondary,
        success && styles.successButton,
        warning && styles.warningButton,
        danger && styles.dangerButton,
        disabled && styles.disabled,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          secondary && styles.secondaryText,
          danger && styles.error,
          success && { color: colors.success },
          warning && { color: colors.warning },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}
/** Associates a text field with a label and inline validation error. */
export function Field({ label, error, ...props }) {
  return (
    <View style={styles.field}>
      <Text style={styles.muted}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        style={styles.input}
        {...props}
      />
      {!!error && (
        <Text accessibilityLiveRegion="polite" style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}
/** Displays a retryable API error. */
export function ErrorBanner({ message, retry }) {
  return message ? (
    <View style={styles.card}>
      <Text accessibilityRole="alert" style={styles.error}>
        {message}
      </Text>
      {retry && <Button secondary title="Retry" onPress={retry} />}
    </View>
  ) : null;
}
/** Announces loading without replacing a screen with an empty view. */
export function Loading() {
  return (
    <View style={styles.content}>
      <ActivityIndicator color={colors.accent} accessibilityLabel="Loading" />
      <Text style={styles.muted}>Loading…</Text>
    </View>
  );
}
/** Explains empty or filtered resource lists. */
export function Empty({ title, message }) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>{title}</Text>
      <Text style={styles.muted}>{message}</Text>
    </View>
  );
}
/** Provides an accessible native modal selector without another picker dependency. */
export function Choice({
  label,
  value,
  options,
  onChange,
  disabled = false,
  error,
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);
  return (
    <View style={styles.field}>
      <Text style={styles.muted}>{label}</Text>
      <Button
        secondary
        disabled={disabled}
        title={`${label}: ${selected?.label || "Choose"}`}
        onPress={() => setOpen(true)}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Modal
        visible={open}
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <SafeAreaView style={styles.screen}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.heading}>{label}</Text>
            {options.map((option) => (
              <Button
                key={option.value}
                secondary
                title={option.label}
                onPress={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              />
            ))}
            <Button title="Cancel" onPress={() => setOpen(false)} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
