"use client";
import { Input, Select } from "@/components/ui";
import {
  label,
  PROJECT_STATUSES,
  TASK_STATUSES,
  PRIORITIES,
} from "@/lib/validators";

/** Captures search and enum filters for server-side querying. */
export default function Filters({ filters, onChange, tasks = false }) {
  /** Changes one filter without losing the others. */
  function change(key, value) {
    onChange({ ...filters, [key]: value });
  }
  return (
    <div
      className={`grid gap-4 ${tasks ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}
    >
      <Input
        label="Search by name"
        type="search"
        value={filters.search}
        onChange={(event) => change("search", event.target.value)}
        placeholder={`Search ${tasks ? "tasks" : "projects"}…`}
      />
      <Select
        label="Status"
        value={filters.status}
        onChange={(event) => change("status", event.target.value)}
      >
        <option value="">All statuses</option>
        {(tasks ? TASK_STATUSES : PROJECT_STATUSES).map((value) => (
          <option key={value} value={value}>
            {label(value)}
          </option>
        ))}
      </Select>
      {tasks && (
        <Select
          label="Priority"
          value={filters.priority}
          onChange={(event) => change("priority", event.target.value)}
        >
          <option value="">All priorities</option>
          {PRIORITIES.map((value) => (
            <option key={value} value={value}>
              {label(value)}
            </option>
          ))}
        </Select>
      )}
    </div>
  );
}
