import api from "./api";

/** Fetches a resource using the shared web/mobile API contract. */
export async function fetchResource(path, params, signal) {
  return (await api.get(path, { params, signal })).data;
}
/** Creates or updates a project or task. */
export async function saveResource(resource, data, id) {
  // Reason: A task's project is immutable; strict update schemas reject projectId.
  const payload =
    id && resource === "tasks"
      ? Object.fromEntries(
          Object.entries(data).filter(([key]) => key !== "projectId"),
        )
      : data;
  return id
    ? api.put(`/${resource}/${id}`, payload)
    : api.post(`/${resource}`, payload);
}
/** Deletes a project or task. */
export async function deleteResource(resource, id) {
  await api.delete(`/${resource}/${id}`);
}
/** Marks a task complete or pending. */
export async function setTaskCompleted(task) {
  await api.put(`/tasks/${task.id}`, {
    status: task.status === "COMPLETED" ? "PENDING" : "COMPLETED",
  });
}
