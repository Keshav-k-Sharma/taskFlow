"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  projectSchema,
  taskSchema,
  PROJECT_STATUSES,
  TASK_STATUSES,
  PRIORITIES,
  label,
  inputDate,
  formPayload,
} from "@/lib/validators";
import { saveResource } from "@/lib/resources";
import { errorMessage } from "@/lib/api";
import { Button, Input, Select, Modal, ErrorBanner } from "@/components/ui";

/** Creates or edits a project/task using the shared API fields. */
export default function ResourceForm({
  resource,
  item,
  projects = [],
  projectId,
  onClose,
  onSaved,
}) {
  const isTask = resource === "tasks";
  const [error, setError] = useState("");
  const defaults = {
    name: item?.name || "",
    description: item?.description || "",
    status: item?.status || (isTask ? "PENDING" : "NOT_STARTED"),
    ...(isTask
      ? {
          projectId: item?.projectId || projectId || "",
          priority: item?.priority || "MEDIUM",
          dueDate: inputDate(item?.dueDate),
        }
      : {
          startDate: inputDate(item?.startDate),
          endDate: inputDate(item?.endDate),
        }),
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(isTask ? taskSchema : projectSchema),
    defaultValues: defaults,
  });
  /** Persists a validated form and refreshes the owning data view. */
  async function submit(values) {
    setError("");
    const data = formPayload(values);
    // Reason: Updating tasks cannot move them; the update API accepts no projectId.
    if (isTask && item) delete data.projectId;
    try {
      await saveResource(resource, data, item?.id);
      onSaved();
    } catch (failure) {
      setError(errorMessage(failure));
    }
  }
  return (
    <Modal
      title={`${item ? "Edit" : "Create"} ${isTask ? "task" : "project"}`}
      onClose={onClose}
      busy={isSubmitting}
    >
      <ErrorBanner message={error} />
      <form noValidate onSubmit={handleSubmit(submit)}>
        <fieldset disabled={isSubmitting} className="space-y-4">
          <Input
            label="Name"
            maxLength={150}
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="Description"
            multiline
            rows={3}
            error={errors.description?.message}
            {...register("description")}
          />
          {isTask && (
            <Select
              label="Project"
              error={errors.projectId?.message}
              {...register("projectId")}
              disabled={!!item || !!projectId}
            >
              <option value="">Choose a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </Select>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Status"
              {...register("status")}
              error={errors.status?.message}
            >
              {(isTask ? TASK_STATUSES : PROJECT_STATUSES).map((value) => (
                <option key={value} value={value}>
                  {label(value)}
                </option>
              ))}
            </Select>
            {isTask && (
              <Select
                label="Priority"
                {...register("priority")}
                error={errors.priority?.message}
              >
                {PRIORITIES.map((value) => (
                  <option key={value} value={value}>
                    {label(value)}
                  </option>
                ))}
              </Select>
            )}
          </div>
          {isTask ? (
            <Input
              label="Due date (optional)"
              type="date"
              error={errors.dueDate?.message}
              {...register("dueDate")}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Start date (optional)"
                type="date"
                error={errors.startDate?.message}
                {...register("startDate")}
              />
              <Input
                label="End date (optional)"
                type="date"
                error={errors.endDate?.message}
                {...register("endDate")}
              />
            </div>
          )}
          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save"}
            </Button>
          </div>
        </fieldset>
      </form>
    </Modal>
  );
}
