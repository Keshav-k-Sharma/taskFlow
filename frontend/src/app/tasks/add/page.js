import { redirect } from "next/navigation";
/** Preserves old create links by sending them to the task dialog view. */
export default function AddTaskPage() {
  redirect("/tasks");
}
