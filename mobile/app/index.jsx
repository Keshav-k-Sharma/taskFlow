import { Redirect } from "expo-router";
import { useAuth } from "../src/context/AuthProvider";
/** Sends startup navigation to the verified session's landing screen. */
export default function Index() {
  const { user } = useAuth();
  return <Redirect href={user ? "/dashboard" : "/login"} />;
}
