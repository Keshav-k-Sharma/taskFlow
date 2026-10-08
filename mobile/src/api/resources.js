import client from "./client";

/** Creates an owned project using the shared web/mobile API. */
export async function createProject(values) {
  return client.post("/projects", values);
}

/** Fetches a dashboard, project, or task resource. */
export async function fetchResource(path, params, signal) {
  return (await client.get(path, { params, signal })).data;
}
/** Creates or updates a task using the same payload as the web app. */
export async function saveTask(values, id) {
  return id
    ? client.put(`/tasks/${id}`, values)
    : client.post("/tasks", values);
}
/** Updates task status or priority without sending other fields. */
export async function updateTask(id, values) {
  await client.put(`/tasks/${id}`, values);
}
/** Deletes a task after UI confirmation. */
export async function deleteTask(id) {
  await client.delete(`/tasks/${id}`);
}
