import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyboardAvoidingView, Platform, ScrollView, Text } from "react-native";
import { router } from "expo-router";
import { saveTask } from "../api/resources";
import { errorMessage } from "../api/client";
import {
  PRIORITIES,
  TASK_STATUSES,
  label,
  taskPayload,
  taskSchema,
} from "../utils/validators";
import { Button, Choice, ErrorBanner, Field, Screen, styles } from "./ui";
import DateField from "./DateField";

/** Creates or edits a validated task with native enum/date controls. */
export default function TaskForm({ item, projectId, projects }) {
  const [error, setError] = useState("");
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
      projectId: item?.projectId || projectId || "",
      status: item?.status || "PENDING",
      priority: item?.priority || "MEDIUM",
      dueDate: item?.dueDate?.slice(0, 10) || "",
    },
  });
  /** Returns to the previous list, including safe handling of direct links. */
  function close() {
    if (router.canGoBack()) router.back();
    else router.replace("/tasks");
  }
  /** Saves the whitelisted API payload and refreshes lists when they regain focus. */
  async function submit(values) {
    setError("");
    try {
      await saveTask(taskPayload(values, !!item), item?.id);
      close();
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
          <Text style={styles.title}>{item ? "Edit task" : "Create task"}</Text>
          <ErrorBanner message={error} />
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Field
                label="Name"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                maxLength={150}
                editable={!isSubmitting}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Field
                label="Description"
                multiline
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                editable={!isSubmitting}
              />
            )}
          />
          <Controller
            name="projectId"
            control={control}
            render={({ field, fieldState }) => (
              <Choice
                label="Project"
                value={field.value}
                onChange={field.onChange}
                options={projects.map((project) => ({
                  value: project.id,
                  label: project.name,
                }))}
                disabled={isSubmitting || !!item || !!projectId}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="status"
            control={control}
            render={({ field, fieldState }) => (
              <Choice
                label="Status"
                value={field.value}
                onChange={field.onChange}
                options={TASK_STATUSES.map((value) => ({
                  value,
                  label: label(value),
                }))}
                disabled={isSubmitting}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="priority"
            control={control}
            render={({ field, fieldState }) => (
              <Choice
                label="Priority"
                value={field.value}
                onChange={field.onChange}
                options={PRIORITIES.map((value) => ({
                  value,
                  label: label(value),
                }))}
                disabled={isSubmitting}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="dueDate"
            control={control}
            render={({ field, fieldState }) => (
              <DateField
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
          <Button
            title={isSubmitting ? "Saving…" : "Save task"}
            disabled={isSubmitting || !projects.length}
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
