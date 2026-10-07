"use client";
import { useCallback, useEffect, useState } from "react";
import { fetchResource } from "@/lib/resources";
import { errorMessage } from "@/lib/api";

/** Loads resources, aborts stale requests, and exposes retry/refresh. */
export default function useResource(path, params = {}) {
  const query = JSON.stringify(params);
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState({ data: null, loading: true, error: "" });
  useEffect(() => {
    const controller = new AbortController();
    /** Loads only the latest filter selection. */
    async function load() {
      setState((previous) => ({ ...previous, loading: true, error: "" }));
      try {
        const data = await fetchResource(
          path,
          JSON.parse(query),
          controller.signal,
        );
        if (!controller.signal.aborted)
          setState({ data, loading: false, error: "" });
      } catch (error) {
        if (!controller.signal.aborted)
          setState({ data: null, loading: false, error: errorMessage(error) });
      }
    }
    load();
    return () => controller.abort();
  }, [path, query, revision]);
  const refresh = useCallback(() => setRevision((value) => value + 1), []);
  return { ...state, refresh };
}
