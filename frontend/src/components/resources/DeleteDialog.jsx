"use client";
import { useState } from "react";
import { deleteResource } from "@/lib/resources";
import { errorMessage } from "@/lib/api";
import { Button, Modal, ErrorBanner } from "@/components/ui";

/** Confirms irreversible deletion and preserves errors for retry. */
export default function DeleteDialog({ resource, item, onClose, onDeleted }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  /** Deletes only after the user confirms the selected resource. */
  async function confirm() {
    setBusy(true);
    setError("");
    try {
      await deleteResource(resource, item.id);
      onDeleted();
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title={`Delete ${resource === "projects" ? "project" : "task"}?`}
      onClose={onClose}
      busy={busy}
    >
      <p className="mb-5 text-ink">
        Delete “{item.name}”?{" "}
        {resource === "projects" &&
          "All tasks in this project will also be deleted. "}
        This cannot be undone.
      </p>
      <ErrorBanner message={error} />
      <div className="flex justify-end gap-3">
        <Button variant="secondary" disabled={busy} onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" disabled={busy} onClick={confirm}>
          {busy ? "Deleting…" : "Delete"}
        </Button>
      </div>
    </Modal>
  );
}
