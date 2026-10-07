import { redirect } from "next/navigation";
/** Opens the authenticated dashboard or its login guard. */
export default function Home() {
  redirect("/dashboard");
}
