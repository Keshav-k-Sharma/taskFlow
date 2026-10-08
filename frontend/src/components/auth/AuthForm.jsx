"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api, { errorMessage } from "@/lib/api";
import { loginSchema, registerSchema } from "@/lib/validators";
import { useAuth } from "./AuthProvider";
import { Button, Input, ErrorBanner } from "@/components/ui";

/** Reads the session-expiry marker within a Suspense boundary. */
function ExpiredBanner() {
  const query = useSearchParams();
  return query.get("expired") === "1" ? (
    <p
      role="status"
      className="rounded-lg border border-amber-200 bg-amber-100 p-3 text-sm text-amber-900"
    >
      Session expired, please log in again.
    </p>
  ) : null;
}
/** Validates login/registration fields and displays server errors. */
export default function AuthForm({ registerMode = false }) {
  const { signIn } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerMode ? registerSchema : loginSchema),
  });
  /** Exchanges validated credentials for a shared API session. */
  async function submit(values) {
    setError("");
    try {
      const { data } = await api.post(
        `/auth/${registerMode ? "register" : "login"}`,
        values,
      );
      signIn(data);
      router.replace("/dashboard");
    } catch (failure) {
      setError(errorMessage(failure));
    }
  }
  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-12">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <Link href="/" className="text-2xl font-bold">
          <span className="text-accent">Task</span>Flow
        </Link>
        <div>
          <h1 className="mt-6 text-2xl font-semibold">
            {registerMode ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            Your projects and tasks, in one place.
          </p>
        </div>
        <Suspense>
          <ExpiredBanner />
        </Suspense>
        <ErrorBanner message={error} />
        <form noValidate onSubmit={handleSubmit(submit)} className="space-y-5">
          <fieldset disabled={isSubmitting} className="space-y-5">
            {registerMode && (
              <Input
                label="Full name"
                autoComplete="name"
                error={errors.fullName?.message}
                {...register("fullName")}
              />
            )}
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Password"
              type="password"
              autoComplete={registerMode ? "new-password" : "current-password"}
              error={errors.password?.message}
              {...register("password")}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? "Please wait…"
                : registerMode
                  ? "Create account"
                  : "Log in"}
            </Button>
          </fieldset>
        </form>
        <p className="text-center text-sm text-muted">
          {registerMode ? "Already have an account? " : "New to TaskFlow? "}
          <Link
            href={registerMode ? "/login" : "/register"}
            className="text-accent underline"
          >
            {registerMode ? "Log in" : "Create an account"}
          </Link>
        </p>
      </div>
    </main>
  );
}
