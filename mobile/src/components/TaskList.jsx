import { useState } from "react";
import { Alert, FlatList, RefreshControl, Text, View } from "react-native";
import { router } from "expo-router";
import useResource from "../hooks/useResource";
import useDebounce from "../hooks/useDebounce";
import { deleteTask, updateTask } from "../api/resources";
import { errorMessage } from "../api/client";
import { PRIORITIES, TASK_STATUSES, label } from "../utils/validators";
import {
  Button,
  Choice,
  colors,
  Empty,
  ErrorBanner,
  Field,
  Loading,
  styles,
} from "./ui";

/** Lists and manages owned tasks with pull-to-refresh and server-side filters. */
export default function TaskList({ projectId, header }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const debounced = useDebounce(search);
  const params = Object.fromEntries(
    Object.entries({ projectId, search: debounced, status, priority }).filter(
      ([, value]) => value,
    ),
  );
  const { data, loading, error, refresh } = useResource("/tasks", params);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const [retryAction, setRetryAction] = useState(null);
  /** Applies a task mutation and reports any recoverable failure. */
  async function mutate(action, success) {
    setBusy(true);
    setActionError("");
    setNotice("");
    setRetryAction(null);
    try {
      await action();
      setNotice(success);
      refresh();
    } catch (failure) {
      setActionError(errorMessage(failure));
      setRetryAction(() => () => mutate(action, success));
    } finally {
      setBusy(false);
    }
  }
  /** Sends one whitelisted quick-change field outside the render markup. */
  function changeTask(task, field, value) {
    return mutate(
      () => updateTask(task.id, { [field]: value }),
      `${label(field)} updated.`,
    );
  }
  /** Toggles task completion using the same status values as the web. */
  function completeTask(task) {
    return changeTask(
      task,
      "status",
      task.status === "COMPLETED" ? "PENDING" : "COMPLETED",
    );
  }
  /** Confirms deletion before calling the API. */
  function confirmDelete(task) {
    Alert.alert(
      "Delete task?",
      `Delete “${task.name}”? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => mutate(() => deleteTask(task.id), "Task deleted."),
        },
      ],
    );
  }
  return (
    <FlatList
      data={data?.tasks || []}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={refresh}
          tintColor={colors.accent}
        />
      }
      ListHeaderComponent={
        <View style={styles.field}>
          {header}
          <Text style={styles.title}>Tasks</Text>
          <Text style={styles.muted}>Your board · one step at a time</Text>
          <View style={styles.row}>
            {["", ...TASK_STATUSES].map((value) => (
              <Button
                key={value}
                title={value ? label(value) : "All tasks"}
                secondary={status !== value}
                onPress={() => setStatus(value)}
              />
            ))}
          </View>
          <Button
            title="Create task"
            disabled={busy}
            onPress={() =>
              router.push({
                pathname: "/tasks/form",
                params: projectId ? { projectId } : {},
              })
            }
          />
          <Field label="Search tasks" value={search} onChangeText={setSearch} />
          <Choice
            label="Status filter"
            value={status}
            onChange={setStatus}
            options={[
              { value: "", label: "All statuses" },
              ...TASK_STATUSES.map((value) => ({ value, label: label(value) })),
            ]}
          />
          <Choice
            label="Priority filter"
            value={priority}
            onChange={setPriority}
            options={[
              { value: "", label: "All priorities" },
              ...PRIORITIES.map((value) => ({ value, label: label(value) })),
            ]}
          />
          <ErrorBanner message={error} retry={refresh} />
          <ErrorBanner message={actionError} retry={retryAction} />
          {!!notice && (
            <Text accessibilityLiveRegion="polite" style={styles.muted}>
              {notice}
            </Text>
          )}
        </View>
      }
      ListEmptyComponent={
        loading ? (
          <Loading />
        ) : (
          !error && (
            <Empty
              title={
                search || status || priority
                  ? "No matching tasks"
                  : "No tasks yet"
              }
              message="Create a task or adjust the filters."
            />
          )
        )
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.row}>
            <Text
              style={[
                styles.pill,
                {
                  color:
                    item.status === "COMPLETED"
                      ? colors.success
                      : item.status === "IN_PROGRESS"
                        ? colors.info
                        : colors.warning,
                },
              ]}
            >
              {label(item.status)}
            </Text>
            <Text
              style={[
                styles.pill,
                {
                  color: item.priority === "HIGH" ? colors.danger : colors.text,
                },
              ]}
            >
              {label(item.priority)} priority
            </Text>
          </View>
          <Text style={styles.heading}>{item.name}</Text>
          <Text style={styles.muted}>
            {item.description || "No description"}
          </Text>
          <Text style={styles.muted}>
            Due: {item.dueDate?.slice(0, 10) || "No due date"}
          </Text>
          <Choice
            label="Status"
            value={item.status}
            disabled={busy}
            options={TASK_STATUSES.map((value) => ({
              value,
              label: label(value),
            }))}
            onChange={(value) => changeTask(item, "status", value)}
          />
          <Choice
            label="Priority"
            value={item.priority}
            disabled={busy}
            options={PRIORITIES.map((value) => ({
              value,
              label: label(value),
            }))}
            onChange={(value) => changeTask(item, "priority", value)}
          />
          <Button
            secondary
            success={item.status !== "COMPLETED"}
            warning={item.status === "COMPLETED"}
            disabled={busy}
            title={
              item.status === "COMPLETED" ? "Mark pending" : "Mark complete"
            }
            onPress={() => completeTask(item)}
          />
          <View style={styles.row}>
            <Button
              secondary
              disabled={busy}
              title="Edit"
              onPress={() =>
                router.push({
                  pathname: "/tasks/form",
                  params: { id: item.id },
                })
              }
            />
            <Button
              secondary
              danger
              disabled={busy}
              title="Delete"
              onPress={() => confirmDelete(item)}
            />
            {!projectId && (
              <Button
                secondary
                title="View project"
                onPress={() =>
                  router.push({
                    pathname: "/projects/[id]",
                    params: { id: item.projectId },
                  })
                }
              />
            )}
          </View>
        </View>
      )}
    />
  );
}
