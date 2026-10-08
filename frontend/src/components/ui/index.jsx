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
      ? "border-red-200 bg-red-100 text-red-900"
      : variant === "success"
        ? "border-emerald-200 bg-emerald-100 text-emerald-900"
        : variant === "warning"
          ? "border-amber-200 bg-amber-100 text-amber-900"
          : variant === "secondary"
            ? "border-line bg-surface text-ink"
            : "border-accent bg-accent text-on-accent";
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
      <label htmlFor={id} className="block text-sm text-ink">
        {title}
      </label>
      <Tag
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="min-h-11 w-full rounded-lg border border-line bg-canvas px-3 py-2 text-ink"
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-800">
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
      <label htmlFor={id} className="block text-sm text-ink">
        {title}
      </label>
      <select
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="min-h-11 w-full rounded-lg border border-line bg-canvas px-3 py-2"
        {...props}
      >
        {children}
      </select>
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-800">
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
      <p className="text-muted">Loading…</p>
      <div className="h-24 animate-pulse rounded-xl bg-surface" />
      <div className="h-24 animate-pulse rounded-xl bg-surface" />
    </div>
  );
}
/** Displays a status or priority label. */
export function Badge({ value }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs ${value === "COMPLETED" ? "border-green-200 text-green-800" : value === "HIGH" ? "border-red-200 text-red-800" : "border-line text-ink"}`}
    >
      {label(value)}
    </span>
  );
}
/** Explains an empty view and its next action. */
export function EmptyState({ title = "Nothing here yet", children }) {
  return (
    <div className="rounded-xl border border-dashed border-line p-10 text-center">
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted">{children}</p>
    </div>
  );
}
/** Announces a successful action without interrupting navigation. */
export function Toast({ message }) {
  return message ? (
    <p
      role="status"
      className="mb-4 rounded-lg border border-green-200 bg-green-100 p-3 text-sm text-green-900"
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
      className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-100 p-4 text-sm text-red-900"
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
    const previouslyFocused = document.activeElement;
    element.showModal();
    return () => {
      element.close();
      // Reason: React unmounts the dialog before native focus restoration completes.
      if (previouslyFocused?.isConnected) previouslyFocused.focus?.();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl border border-line bg-surface p-6 text-ink backdrop:bg-ink/30"
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
