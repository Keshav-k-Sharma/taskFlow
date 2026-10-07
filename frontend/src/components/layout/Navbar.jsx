"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button, ErrorBanner } from "@/components/ui";
import { errorMessage } from "@/lib/api";

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
    <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/95">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight">
          <span className="text-yellow-300">Task</span>Flow
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
          className={`${open ? "flex" : "hidden"} order-3 w-full flex-col gap-2 md:order-none md:flex md:w-auto md:flex-row md:gap-6`}
        >
          {["dashboard", "projects", "tasks"].map((route) => (
            <Link
              key={route}
              href={`/${route}`}
              onClick={() => setOpen(false)}
              aria-current={
                pathname.startsWith(`/${route}`) ? "page" : undefined
              }
              className={`rounded-lg px-2 py-2 text-sm capitalize ${pathname.startsWith(`/${route}`) ? "text-yellow-300" : "text-zinc-400 hover:text-zinc-100"}`}
            >
              {route}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-zinc-400 sm:block">
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
