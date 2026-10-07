"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { ErrorBanner, Spinner } from "@/components/ui";
import Navbar from "./Navbar";

/** Withholds protected data views until the server verifies the session. */
export default function ProtectedPage({ children }) {
  const { user, loading, error, retry } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user && !error) router.replace("/login");
  }, [loading, user, error, router]);
  if (loading)
    return (
      <main className="mx-auto max-w-lg p-6">
        <Spinner />
      </main>
    );
  if (error)
    return (
      <main className="mx-auto max-w-lg p-6">
        <ErrorBanner message={error} retry={retry} />
      </main>
    );
  if (!user) return null;
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-6 px-5 py-8 md:py-12">
        {children}
      </main>
    </>
  );
}
