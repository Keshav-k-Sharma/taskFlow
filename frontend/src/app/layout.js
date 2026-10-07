import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";

export const metadata = {
  title: "TaskFlow",
  description: "Your projects and tasks, together on web and mobile.",
};

/** Supplies the shared session to all web routes. */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
