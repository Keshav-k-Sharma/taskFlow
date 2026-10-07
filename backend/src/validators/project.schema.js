const { z } = require("zod");

const isoDate = z.iso
  .date("Must be a valid calendar date (YYYY-MM-DD)")
  .optional()
  .nullable();

/**
 * Zod schema for POST /api/projects (create).
 */
const createProjectSchema = z
  .object({
    name: z
      .string({ required_error: "Project name is required" })
      .trim()
      .min(1, "Name cannot be empty")
      .max(150),
    description: z.string().trim().optional().nullable(),
    status: z
      .enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"])
      .default("NOT_STARTED"),
    startDate: isoDate,
    endDate: isoDate,
  })
  .strict()
  .refine(
    (d) => {
      if (d.startDate && d.endDate) return d.endDate >= d.startDate;
      return true;
    },
    { message: "endDate must be on or after startDate", path: ["endDate"] }
  );

/**
 * Zod schema for PUT /api/projects/:id (update — all fields optional).
 */
const updateProjectSchema = z
  .object({
    name: z.string().trim().min(1).max(150).optional(),
    description: z.string().trim().optional().nullable(),
    status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]).optional(),
    startDate: isoDate,
    endDate: isoDate,
  })
  .strict()
  .refine(
    (d) => {
      if (d.startDate && d.endDate) return d.endDate >= d.startDate;
      return true;
    },
    { message: "endDate must be on or after startDate", path: ["endDate"] }
  );

/**
 * Zod schema for GET /api/projects query params.
 */
const listProjectsSchema = z
  .object({
    search: z.string().trim().optional(),
    status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]).optional(),
  })
  .strict();

/**
 * UUID param schema.
 */
const uuidParamSchema = z
  .object({
    id: z.string().uuid("Invalid project ID"),
  })
  .strict();

module.exports = {
  createProjectSchema,
  updateProjectSchema,
  listProjectsSchema,
  uuidParamSchema,
};
