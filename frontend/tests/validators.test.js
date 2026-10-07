import { test, expect } from "@jest/globals";
import {
  projectSchema,
  taskSchema,
  registerSchema,
  formPayload,
  inputDate,
  label,
} from "@/lib/validators";

test("project forms reject reversed dates and impossible calendar dates", () => {
  const data = {
    name: "Project",
    description: "",
    status: "NOT_STARTED",
    startDate: "2026-10-07",
    endDate: "2026-10-06",
  };
  expect(projectSchema.safeParse(data).success).toBe(false);
  expect(
    projectSchema.safeParse({ ...data, startDate: "2026-02-30", endDate: "" })
      .success,
  ).toBe(false);
  expect(
    projectSchema.safeParse({ ...data, startDate: "", endDate: "" }).success,
  ).toBe(true);
});
test("task forms require project and enum values but allow no due date", () => {
  const data = {
    name: "Task",
    description: "",
    projectId: "70bd45bb-8e2a-443b-ade8-97b0a372a560",
    status: "PENDING",
    priority: "MEDIUM",
    dueDate: "",
  };
  expect(taskSchema.safeParse(data).success).toBe(true);
  expect(taskSchema.safeParse({ ...data, projectId: "" }).success).toBe(false);
  expect(taskSchema.safeParse({ ...data, priority: "URGENT" }).success).toBe(
    false,
  );
});
test("registration rejects short passwords and invalid emails", () => {
  expect(
    registerSchema.safeParse({
      fullName: "User",
      email: "invalid",
      password: "short",
    }).success,
  ).toBe(false);
});
test("date payloads remain calendar dates and cleared dates become null", () => {
  expect(inputDate("2026-10-07T00:00:00.000Z")).toBe("2026-10-07");
  expect(formPayload({ dueDate: "", name: "Task" })).toEqual({
    dueDate: null,
    name: "Task",
  });
  expect(label("IN_PROGRESS")).toBe("In Progress");
});
