import { z } from "zod";
export const PROJECT_STATUSES = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"];
export const TASK_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED"];
export const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];
export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export const registerSchema = loginSchema.extend({
  fullName: z.string().trim().min(1, "Full name is required").max(100),
  password: z.string().min(8, "Use at least 8 characters"),
});
export const taskSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(150),
  description: z.string(),
  projectId: z.uuid("Choose a project"),
  priority: z.enum(PRIORITIES),
  status: z.enum(TASK_STATUSES),
  dueDate: z.union([z.literal(""), z.iso.date()]),
});
/** Converts enum values to the labels used by the web app. */
export function label(value) {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}
/** Builds a whitelisted task payload and omits projectId when editing. */
export function taskPayload(values, editing = false) {
  const { name, description, projectId, status, priority, dueDate } = values;
  return {
    name,
    description,
    status,
    priority,
    dueDate: dueDate || null,
    ...(!editing && { projectId }),
  };
}
/** Formats local calendar dates without UTC timezone shifts. */
export function calendarDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
