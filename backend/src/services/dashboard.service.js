const prisma = require("../db/prisma");

/**
 * Returns dashboard stats scoped to the authenticated user.
 * - totalProjects: all projects owned by user
 * - totalTasks: all tasks under owned projects
 * - completedTasks: tasks with status COMPLETED
 * - pendingTasks: tasks with status PENDING
 * - projectsInProgress: projects with status IN_PROGRESS
 *
 * @param {string} ownerId
 * @returns {Promise<object>}
 */
async function getDashboard(ownerId) {
  const [
    totalProjects,
    projectsInProgress,
    totalTasks,
    completedTasks,
    pendingTasks,
  ] = await Promise.all([
    prisma.project.count({ where: { owner_id: ownerId } }),
    prisma.project.count({ where: { owner_id: ownerId, status: "IN_PROGRESS" } }),
    prisma.task.count({ where: { project: { owner_id: ownerId } } }),
    prisma.task.count({ where: { project: { owner_id: ownerId }, status: "COMPLETED" } }),
    prisma.task.count({ where: { project: { owner_id: ownerId }, status: "PENDING" } }),
  ]);

  return {
    totalProjects,
    totalTasks,
    completedTasks,
    pendingTasks,
    projectsInProgress,
  };
}

module.exports = { getDashboard };
