import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyboardAvoidingView, Platform, ScrollView, Text } from "react-native";
import { router } from "expo-router";
import { createProject } from "../api/resources";
import { errorMessage } from "../api/client";
import {
  PROJECT_STATUSES,
  label,
  projectPayload,
  projectSchema,
} from "../utils/validators";
import { Button, Choice, ErrorBanner, Field, Screen, styles } from "./ui";
import DateField from "./DateField";

/** Creates a project with validated fields and recoverable API errors. */
export default function ProjectForm() {
  const [error, setError] = useState("");
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "NOT_STARTED",
      startDate: "",
      endDate: "",
    },
  });
  /** Returns to the project list so it refreshes through its focus hook. */
  function close() {
    if (router.canGoBack()) router.back();
    else router.replace("/projects");
  }
  /** Sends only the fields accepted by the shared project endpoint. */
  async function submit(values) {
    setError("");
    try {
      await createProject(projectPayload(values));
      router.replace("/projects");
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
          <Text style={styles.title}>Create project</Text>
          <Text style={styles.muted}>
            Organize your work, then add tasks to your project.
          </Text>
          <ErrorBanner message={error} />
          {["name", "description"].map((name) => (
            <Controller
              key={name}
              name={name}
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  label={name === "name" ? "Name" : "Description"}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  multiline={name === "description"}
                  maxLength={name === "name" ? 150 : undefined}
                  editable={!isSubmitting}
                  error={fieldState.error?.message}
                />
              )}
            />
          ))}
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Choice
                label="Status"
                value={field.value}
                onChange={field.onChange}
                disabled={isSubmitting}
                options={PROJECT_STATUSES.map((value) => ({
                  value,
                  label: label(value),
                }))}
              />
            )}
          />
          {["startDate", "endDate"].map((name) => (
            <Controller
              key={name}
              name={name}
              control={control}
              render={({ field, fieldState }) => (
                <DateField
                  label={name === "startDate" ? "Start date" : "End date"}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                  error={fieldState.error?.message}
                />
              )}
            />
          ))}
          <Button
            title={isSubmitting ? "Saving…" : "Save project"}
            disabled={isSubmitting}
            onPress={handleSubmit(submit)}
          />
          <Button
            secondary
            title="Cancel"
            disabled={isSubmitting}
            onPress={close}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
