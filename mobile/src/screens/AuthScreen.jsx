import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../context/AuthProvider";
import { loginSchema, registerSchema } from "../utils/validators";
import { errorMessage } from "../api/client";
import { Button, ErrorBanner, Field, Screen, styles } from "../components/ui";

/** Renders validated mobile login and registration with secure session persistence. */
export default function AuthScreen({ registerMode = false }) {
  const { signIn, message } = useAuth();
  const [error, setError] = useState("");
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(registerMode ? registerSchema : loginSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });
  /** Exchanges valid credentials and lets the route guard unlock the app. */
  async function submit(values) {
    setError("");
    try {
      await signIn(values, registerMode);
    } catch (failure) {
      setError(errorMessage(failure));
    }
  }
  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <Text style={styles.title}>TaskFlow</Text>
          <Text style={styles.heading}>
            {registerMode ? "Create your account" : "Welcome back"}
          </Text>
          {!!message && (
            <Text accessibilityLiveRegion="polite" style={styles.muted}>
              {message}
            </Text>
          )}
          <ErrorBanner message={error} />
          {registerMode && (
            <Controller
              name="fullName"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  label="Full name"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  autoComplete="name"
                  error={fieldState.error?.message}
                  editable={!isSubmitting}
                />
              )}
            />
          )}
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field
                label="Email"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                error={fieldState.error?.message}
                editable={!isSubmitting}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Field
                label="Password"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                secureTextEntry
                autoComplete={
                  registerMode ? "new-password" : "current-password"
                }
                error={fieldState.error?.message}
                editable={!isSubmitting}
              />
            )}
          />
          <Button
            title={
              isSubmitting
                ? "Please wait…"
                : registerMode
                  ? "Create account"
                  : "Log in"
            }
            disabled={isSubmitting}
            onPress={handleSubmit(submit)}
          />
          <Button
            secondary
            title={
              registerMode ? "Already registered? Log in" : "Create an account"
            }
            disabled={isSubmitting}
            onPress={() =>
              router.replace(registerMode ? "/login" : "/register")
            }
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
