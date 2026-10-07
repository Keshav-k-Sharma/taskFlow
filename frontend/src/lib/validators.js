import { z } from "zod";

export const PROJECT_STATUSES = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"];
export const TASK_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED"];
export const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];
const name = z.string().trim().min(1, "Name is required").max(150);
const date = z.union([z.literal(""), z.iso.date()]);
export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export const registerSchema = loginSchema.extend({
  fullName: z.string().trim().min(1, "Full name is required").max(100),
  password: z.string().min(8, "Use at least 8 characters"),
});
export const projectSchema = z
  .object({
    name,
    description: z.string(),
    status: z.enum(PROJECT_STATUSES),
    startDate: date,
    endDate: date,
  })
  .refine(
    (data) =>
      !data.startDate || !data.endDate || data.endDate >= data.startDate,
    { path: ["endDate"], message: "End date must be on or after start date" },
  );
export const taskSchema = z.object({
  name,
  description: z.string(),
  projectId: z.uuid("Choose a project"),
  priority: z.enum(PRIORITIES),
  status: z.enum(TASK_STATUSES),
  dueDate: date,
});
/** Converts API enum values to consistent user-facing labels. */
export function label(value) {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}
/** Converts form dates to nullable API fields. */
export function formPayload(data) {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      key.endsWith("Date") && !value ? null : value,
    ]),
  );
}
/** Formats a nullable API date without timezone conversion. */
export function inputDate(value) {
  return value ? value.slice(0, 10) : "";
}
