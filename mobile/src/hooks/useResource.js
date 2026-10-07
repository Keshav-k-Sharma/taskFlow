import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { fetchResource } from "../api/resources";
import { errorMessage } from "../api/client";

/** Refreshes focused screens and cancels stale requests on blur/filter changes. */
export default function useResource(path, params = {}) {
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState({ data: null, loading: true, error: "" });
  const requestKey = JSON.stringify({ path, params, revision });
  useFocusEffect(
    useCallback(() => {
      // Reason: Including revision in this key reloads unchanged filters on refresh.
      const { path: resourcePath, params: filters } = JSON.parse(requestKey);
      const controller = new AbortController();
      /** Loads the current server-side query and ignores cancelled responses. */
      async function load() {
        setState((previous) => ({ ...previous, loading: true, error: "" }));
        try {
          const data = await fetchResource(
            resourcePath,
            filters,
            controller.signal,
          );
          if (!controller.signal.aborted)
            setState({ data, loading: false, error: "" });
        } catch (failure) {
          if (!controller.signal.aborted)
            setState((previous) => ({
              ...previous,
              loading: false,
              error: errorMessage(failure),
            }));
        }
      }
      load();
      return () => controller.abort();
    }, [requestKey]),
  );
  const refresh = useCallback(() => setRevision((value) => value + 1), []);
  return { ...state, refresh };
}
