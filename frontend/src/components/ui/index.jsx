"use client";
import { useEffect, useId, useRef } from "react";
import { label } from "@/lib/validators";

/** Renders a consistent accessible action button. */
export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const colors =
    variant === "danger"
      ? "border-red-700 bg-red-950 text-red-200"
      : variant === "secondary"
        ? "border-zinc-700 bg-zinc-900 text-zinc-100"
        : "border-yellow-300 bg-yellow-300 text-zinc-950";
  return (
    <button
      className={`min-h-11 rounded-lg border px-4 py-2 text-sm font-semibold transition hover:brightness-110 disabled:opacity-50 ${colors} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
/** Associates a label and inline validation error with an input. */
export function Input({ label: title, error, multiline = false, ...props }) {
  const id = useId();
  const Tag = multiline ? "textarea" : "input";
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm text-zinc-300">
        {title}
      </label>
      <Tag
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="min-h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
/** Renders a labelled select with validation errors. */
export function Select({ label: title, error, children, ...props }) {
  const id = useId();
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm text-zinc-300">
        {title}
      </label>
      <select
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="min-h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
        {...props}
      >
        {children}
      </select>
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
/** Announces background activity and provides loading skeletons. */
export function Spinner() {
  return (
    <div role="status" className="space-y-4 py-8">
      <p className="text-zinc-400">Loading…</p>
      <div className="h-24 animate-pulse rounded-xl bg-zinc-900" />
      <div className="h-24 animate-pulse rounded-xl bg-zinc-900" />
    </div>
  );
}
/** Displays a status or priority label. */
export function Badge({ value }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs ${value === "COMPLETED" ? "border-green-800 text-green-300" : value === "HIGH" ? "border-red-800 text-red-300" : "border-zinc-700 text-zinc-300"}`}
    >
      {label(value)}
    </span>
  );
}
/** Explains an empty view and its next action. */
export function EmptyState({ title = "Nothing here yet", children }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-700 p-10 text-center">
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-zinc-400">{children}</p>
    </div>
  );
}
/** Announces a successful action without interrupting navigation. */
export function Toast({ message }) {
  return message ? (
    <p
      role="status"
      className="mb-4 rounded-lg border border-green-800 bg-green-950 p-3 text-sm text-green-200"
    >
      {message}
    </p>
  ) : null;
}
/** Shows a recoverable error and optional retry action. */
export function ErrorBanner({ message, retry }) {
  return message ? (
    <div
      role="alert"
      className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-800 bg-red-950 p-4 text-sm text-red-200"
    >
      <p>{message}</p>
      {retry && (
        <Button variant="secondary" onClick={retry}>
          Retry
        </Button>
      )}
    </div>
  ) : null;
}
/** Uses a native dialog for focus trapping, escape handling and focus restoration. */
export function Modal({ title, onClose, children, busy = false }) {
  const dialog = useRef(null);
  const titleId = useId();
  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    return () => element.close();
  }, []);
  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl border border-zinc-700 bg-zinc-900 p-6 text-zinc-100 backdrop:bg-black/70"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 id={titleId} className="text-xl font-semibold">
          {title}
        </h2>
        <Button
          variant="secondary"
          disabled={busy}
          onClick={onClose}
          aria-label="Close dialog"
        >
          ✕
        </Button>
      </div>
      {children}
    </dialog>
  );
}
