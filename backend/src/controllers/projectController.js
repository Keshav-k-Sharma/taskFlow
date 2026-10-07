const projectService = require("../services/project.service");

/**
 * GET /api/projects
 * @type {import('express').RequestHandler}
 */
async function listProjects(req, res) {
  const projects = await projectService.listProjects(req.user.id, req.query);
  res.json({ projects });
}

/**
 * GET /api/projects/:id
 * @type {import('express').RequestHandler}
 */
async function getProject(req, res) {
  const project = await projectService.getProject(req.params.id, req.user.id);
  res.json({ project });
}

/**
 * POST /api/projects
 * @type {import('express').RequestHandler}
 */
async function createProject(req, res) {
  const project = await projectService.createProject(req.user.id, req.body);
  res.status(201).json({ project });
}

/**
 * PUT /api/projects/:id
 * @type {import('express').RequestHandler}
 */
async function updateProject(req, res) {
  const project = await projectService.updateProject(req.params.id, req.user.id, req.body);
  res.json({ project });
}

/**
 * DELETE /api/projects/:id
 * @type {import('express').RequestHandler}
 */
async function deleteProject(req, res) {
  await projectService.deleteProject(req.params.id, req.user.id);
  res.status(204).send();
}

module.exports = {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};