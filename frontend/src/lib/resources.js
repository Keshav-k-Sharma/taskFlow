import api from "./api";

/** Fetches a resource using the shared web/mobile API contract. */
export async function fetchResource(path, params, signal) {
  return (await api.get(path, { params, signal })).data;
}
/** Creates or updates a project or task. */
export async function saveResource(resource, data, id) {
  return id
    ? api.put(`/${resource}/${id}`, data)
    : api.post(`/${resource}`, data);
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
