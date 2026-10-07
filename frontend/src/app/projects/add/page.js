import { redirect } from "next/navigation";
/** Preserves old create links by sending them to the project dialog view. */
export default function AddProjectPage() {
  redirect("/projects");
}
