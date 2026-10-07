const prisma = require("../db/prisma");
const AppError = require("../utils/AppError");

/**
 * Serializes a project for API response.
 * @param {object} project - Raw Prisma project.
 * @returns {object}
 */
function serializeProject(project) {
  return {
    id: project.id,
    name: project.name,
    description: project.description ?? null,
    status: project.status,
    startDate: project.start_date ?? null,
    endDate: project.end_date ?? null,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
    ...(project.tasks !== undefined && {
      tasks: project.tasks.map(serializeTaskBrief),
    }),
  };
}

/**
 * Serializes a task briefly (used when embedded in project detail).
 * @param {object} task - Raw Prisma task.
 * @returns {object}
 */
function serializeTaskBrief(task) {
  return {
    id: task.id,
    name: task.name,
    priority: task.priority,
    status: task.status,
    dueDate: task.due_date ?? null,
    createdAt: task.created_at,
  };
}

/**
 * Lists all projects owned by the authenticated user with optional filters.
 *
 * @param {string} ownerId - Authenticated user's ID.
 * @param {{ search?: string, status?: string }} filters
 * @returns {Promise<object[]>}
 */
async function listProjects(ownerId, filters = {}) {
  const { search, status } = filters;

  const projects = await prisma.project.findMany({
    where: {
      owner_id: ownerId,
      ...(status && { status }),
      ...(search && {
        name: { contains: search, mode: "insensitive" },
      }),
    },
    orderBy: { created_at: "desc" },
  });

  return projects.map(serializeProject);
}

/**
 * Gets a single project by ID, scoped to owner. Includes its tasks.
 *
 * @param {string} id - Project UUID.
 * @param {string} ownerId - Authenticated user's ID.
 * @returns {Promise<object>}
 * @throws {AppError} 404 if not found or not owned by the user.
 */
async function getProject(id, ownerId) {
  const project = await prisma.project.findFirst({
    where: { id, owner_id: ownerId },
    include: {
      tasks: { orderBy: { created_at: "desc" } },
    },
  });

  if (!project) throw new AppError("NOT_FOUND", "Project not found", 404);
  return serializeProject(project);
}

/**
 * Creates a new project owned by the authenticated user.
 *
 * @param {string} ownerId - Authenticated user's ID (from token, not body).
 * @param {{ name: string, description?: string, status?: string, startDate?: string, endDate?: string }} data
 * @returns {Promise<object>}
 */
async function createProject(ownerId, data) {
  const { name, description, status, startDate, endDate } = data;

  const project = await prisma.project.create({
    data: {
      owner_id: ownerId,
      name,
      description: description ?? null,
      status: status ?? "NOT_STARTED",
      start_date: startDate ? new Date(startDate) : null,
      end_date: endDate ? new Date(endDate) : null,
    },
  });

  return serializeProject(project);
}

/**
 * Updates a project, scoped to owner.
 *
 * @param {string} id - Project UUID.
 * @param {string} ownerId - Authenticated user's ID.
 * @param {object} data - Fields to update.
 * @returns {Promise<object>}
 * @throws {AppError} 404 if not found or not owned.
 */
async function updateProject(id, ownerId, data) {
  const existing = await prisma.project.findFirst({
    where: { id, owner_id: ownerId },
  });
  if (!existing) throw new AppError("NOT_FOUND", "Project not found", 404);

  const { name, description, status, startDate, endDate } = data;

  const project = await prisma.project.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status }),
      ...(startDate !== undefined && {
        start_date: startDate ? new Date(startDate) : null,
      }),
      ...(endDate !== undefined && {
        end_date: endDate ? new Date(endDate) : null,
      }),
    },
  });

  return serializeProject(project);
}

/**
 * Deletes a project, scoped to owner. Cascades tasks via DB constraint.
 *
 * @param {string} id - Project UUID.
 * @param {string} ownerId - Authenticated user's ID.
 * @returns {Promise<void>}
 * @throws {AppError} 404 if not found or not owned.
 */
async function deleteProject(id, ownerId) {
  const existing = await prisma.project.findFirst({
    where: { id, owner_id: ownerId },
  });
  if (!existing) throw new AppError("NOT_FOUND", "Project not found", 404);

  await prisma.project.delete({ where: { id } });
}

module.exports = {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};

