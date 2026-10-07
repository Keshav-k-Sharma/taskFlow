import {
  loginSchema,
  registerSchema,
  taskSchema,
  taskPayload,
  calendarDate,
  label,
} from "../src/utils/validators";
const values = {
  name: "Task",
  description: "",
  projectId: "70bd45bb-8e2a-443b-ade8-97b0a372a560",
  status: "PENDING",
  priority: "MEDIUM",
  dueDate: "",
};
test("task forms require an owned project identifier and valid enums", () => {
  expect(taskSchema.safeParse(values).success).toBe(true);
  expect(taskSchema.safeParse({ ...values, projectId: "" }).success).toBe(
    false,
  );
  expect(taskSchema.safeParse({ ...values, priority: "URGENT" }).success).toBe(
    false,
  );
});
test("impossible calendar dates are rejected", () => {
  expect(
    taskSchema.safeParse({ ...values, dueDate: "2026-02-30" }).success,
  ).toBe(false);
});
test("edit payloads omit projectId and clear empty due dates", () => {
  expect(taskPayload(values, true)).toEqual({
    name: "Task",
    description: "",
    status: "PENDING",
    priority: "MEDIUM",
    dueDate: null,
  });
  expect(taskPayload(values).projectId).toBe(values.projectId);
});
test("date picker selection remains a local calendar date", () => {
  expect(calendarDate(new Date(2026, 9, 7, 23, 30))).toBe("2026-10-07");
  expect(label("IN_PROGRESS")).toBe("In Progress");
});
test("auth forms reject invalid emails and short registration passwords", () => {
  expect(
    loginSchema.safeParse({ email: "bad", password: "password" }).success,
  ).toBe(false);
  expect(
    registerSchema.safeParse({
      fullName: "User",
      email: "user@example.com",
      password: "short",
    }).success,
  ).toBe(false);
});
