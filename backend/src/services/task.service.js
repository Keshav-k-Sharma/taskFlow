const prisma = require("../db/prisma");
const AppError = require("../utils/AppError");

/**
 * Serializes a task for API response (camelCase, no internal fields).
 * @param {object} task - Raw Prisma task.
 * @returns {object}
 */
function serializeTask(task) {
  return {
    id: task.id,
    projectId: task.project_id,
    name: task.name,
    description: task.description ?? null,
    priority: task.priority,
    status: task.status,
    dueDate: task.due_date ?? null,
    createdAt: task.created_at,
    updatedAt: task.updated_at,
  };
}

/**
 * Resolves ownership of a task via its parent project.
 * Returns 404 (not 403) if not found or not owned — IDs can't be probed.
 *
 * @param {string} taskId
 * @param {string} ownerId
 * @returns {Promise<object>} The raw task.
 * @throws {AppError} 404 if not found or not owned.
 */
async function findOwnedTask(taskId, ownerId) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: { owner_id: ownerId },
    },
  });
  if (!task) throw new AppError("NOT_FOUND", "Task not found", 404);
  return task;
}

/**
 * Lists tasks owned by the user (via project) with optional filters.
 *
 * @param {string} ownerId
 * @param {{ projectId?: string, search?: string, status?: string, priority?: string }} filters
 * @returns {Promise<object[]>}
 */
async function listTasks(ownerId, filters = {}) {
  const { projectId, search, status, priority } = filters;

  const tasks = await prisma.task.findMany({
    where: {
      project: { owner_id: ownerId },
      ...(projectId && { project_id: projectId }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(search && { name: { contains: search, mode: "insensitive" } }),
    },
    orderBy: { created_at: "desc" },
  });

  return tasks.map(serializeTask);
}

/**
 * Gets a single task by ID, scoped to owner.
 *
 * @param {string} id - Task UUID.
 * @param {string} ownerId
 * @returns {Promise<object>}
 * @throws {AppError} 404 if not found or not owned.
 */
async function getTask(id, ownerId) {
  const task = await findOwnedTask(id, ownerId);
  return serializeTask(task);
}

/**
 * Creates a task under a project owned by the user.
 * Verifies that projectId belongs to the authenticated user.
 *
 * @param {string} ownerId
 * @param {{ projectId: string, name: string, description?: string, priority?: string, status?: string, dueDate?: string }} data
 * @returns {Promise<object>}
 * @throws {AppError} 404 if projectId is not found or not owned.
 */
async function createTask(ownerId, data) {
  const { projectId, name, description, priority, status, dueDate } = data;

  // Reason: Verify project ownership before creating the task
  const project = await prisma.project.findFirst({
    where: { id: projectId, owner_id: ownerId },
  });
  if (!project) throw new AppError("NOT_FOUND", "Project not found", 404);

  const task = await prisma.task.create({
    data: {
      project_id: projectId,
      name,
      description: description ?? null,
      priority: priority ?? "MEDIUM",
      status: status ?? "PENDING",
      due_date: dueDate ? new Date(dueDate) : null,
    },
  });

  return serializeTask(task);
}

/**
 * Updates a task, scoped to owner via project join.
 *
 * @param {string} id - Task UUID.
 * @param {string} ownerId
 * @param {object} data - Fields to update.
 * @returns {Promise<object>}
 * @throws {AppError} 404 if not found or not owned.
 */
async function updateTask(id, ownerId, data) {
  await findOwnedTask(id, ownerId);

  const { name, description, priority, status, dueDate } = data;

  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(priority !== undefined && { priority }),
      ...(status !== undefined && { status }),
      ...(dueDate !== undefined && {
        due_date: dueDate ? new Date(dueDate) : null,
      }),
    },
  });

  return serializeTask(task);
}

/**
 * Deletes a task, scoped to owner.
 *
 * @param {string} id - Task UUID.
 * @param {string} ownerId
 * @returns {Promise<void>}
 * @throws {AppError} 404 if not found or not owned.
 */
async function deleteTask(id, ownerId) {
  await findOwnedTask(id, ownerId);
  await prisma.task.delete({ where: { id } });
}

module.exports = {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
