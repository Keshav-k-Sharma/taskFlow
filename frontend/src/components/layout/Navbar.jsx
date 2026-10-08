"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button, ErrorBanner } from "@/components/ui";
import { errorMessage } from "@/lib/api";
import Icon from "@/components/ui/Icon";

/** Provides responsive navigation and revokes the session on logout. */
export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  /** Completes server logout before returning to login. */
  async function logout() {
    setBusy(true);
    setError("");
    try {
      await signOut();
      router.replace("/login");
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusy(false);
    }
  }
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/95 md:fixed md:bottom-0 md:left-0 md:w-60 md:border-r md:border-b-0">
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 md:h-full md:flex-col md:items-stretch md:justify-start md:gap-8 md:py-8">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight">
          <span className="text-accent">Task</span>Flow
        </Link>
        <Button
          variant="secondary"
          className="md:hidden"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen(!open)}
        >
          Menu
        </Button>
        <nav
          id="main-nav"
          aria-label="Main navigation"
          className={`${open ? "flex" : "hidden"} order-3 w-full flex-col gap-2 md:order-none md:flex`}
        >
          {["dashboard", "projects", "tasks"].map((route) => (
            <Link
              key={route}
              href={`/${route}`}
              onClick={() => setOpen(false)}
              aria-current={
                pathname.startsWith(`/${route}`) ? "page" : undefined
              }
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium capitalize ${pathname.startsWith(`/${route}`) ? "bg-accent/10 text-accent" : "text-muted hover:bg-surface hover:text-ink"}`}
            >
              <Icon name={route} />
              {route}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 md:mt-auto md:flex-col md:items-stretch">
          <span className="hidden text-sm text-muted sm:block">
            {user?.fullName}
          </span>
          <Button variant="secondary" onClick={logout} disabled={busy}>
            {busy ? "Logging out…" : "Logout"}
          </Button>
        </div>
      </div>
      <ErrorBanner message={error} />
    </header>
  );
}
