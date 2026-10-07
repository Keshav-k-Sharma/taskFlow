const taskService = require("../services/task.service");

/**
 * GET /api/tasks
 * @type {import('express').RequestHandler}
 */
async function listTasks(req, res) {
  const tasks = await taskService.listTasks(req.user.id, req.query);
  res.json({ tasks });
}

/**
 * GET /api/tasks/:id
 * @type {import('express').RequestHandler}
 */
async function getTask(req, res) {
  const task = await taskService.getTask(req.params.id, req.user.id);
  res.json({ task });
}

/**
 * POST /api/tasks
 * @type {import('express').RequestHandler}
 */
async function createTask(req, res) {
  const task = await taskService.createTask(req.user.id, req.body);
  res.status(201).json({ task });
}

/**
 * PUT /api/tasks/:id
 * @type {import('express').RequestHandler}
 */
async function updateTask(req, res) {
  const task = await taskService.updateTask(req.params.id, req.user.id, req.body);
  res.json({ task });
}

/**
 * DELETE /api/tasks/:id
 * @type {import('express').RequestHandler}
 */
async function deleteTask(req, res) {
  await taskService.deleteTask(req.params.id, req.user.id);
  res.status(204).send();
}

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };