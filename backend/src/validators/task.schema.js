const { z } = require("zod");

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be a valid date (YYYY-MM-DD)")
  .optional()
  .nullable();

/**
 * Zod schema for POST /api/tasks (create).
 */
const createTaskSchema = z.object({
  projectId: z.string({ required_error: "projectId is required" }).uuid("projectId must be a valid UUID"),
  name: z
    .string({ required_error: "Task name is required" })
    .trim()
    .min(1, "Name cannot be empty")
    .max(150),
  description: z.string().trim().optional().nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).default("PENDING"),
  dueDate: isoDate,
});

/**
 * Zod schema for PUT /api/tasks/:id (update — all optional).
 */
const updateTaskSchema = z.object({
  name: z.string().trim().min(1).max(150).optional(),
  description: z.string().trim().optional().nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
  dueDate: isoDate,
});

/**
 * Zod schema for GET /api/tasks query params.
 */
const listTasksSchema = z.object({
  projectId: z.string().uuid().optional(),
  search: z.string().trim().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
});

/**
 * UUID param schema for tasks.
 */
const taskUuidParamSchema = z.object({
  id: z.string().uuid("Invalid task ID"),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  listTasksSchema,
  taskUuidParamSchema,
};
