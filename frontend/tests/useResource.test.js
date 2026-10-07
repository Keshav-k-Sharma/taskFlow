import { test, expect } from "@jest/globals";
import { renderHook, waitFor, act } from "@testing-library/react";
import useResource from "@/hooks/useResource";
import { fetchResource } from "@/lib/resources";
jest.mock("@/lib/resources", () => ({ fetchResource: jest.fn() }));
test("stale searches are aborted and only the newest response appears", async () => {
  let resolveOld;
  fetchResource
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveOld = resolve;
        }),
    )
    .mockResolvedValueOnce({ tasks: ["new"] });
  const { result, rerender } = renderHook(
    ({ search }) => useResource("/tasks", { search }),
    { initialProps: { search: "old" } },
  );
  const signal = fetchResource.mock.calls[0][2];
  rerender({ search: "new" });
  await waitFor(() => expect(result.current.data).toEqual({ tasks: ["new"] }));
  expect(signal.aborted).toBe(true);
  await act(async () => resolveOld({ tasks: ["old"] }));
  expect(result.current.data).toEqual({ tasks: ["new"] });
});
test("failed fetches expose an error and retry can recover", async () => {
  fetchResource
    .mockRejectedValueOnce(new Error("Network"))
    .mockResolvedValueOnce({ projects: [] });
  const { result } = renderHook(() => useResource("/projects"));
  await waitFor(() => expect(result.current.error).toBeTruthy());
  act(() => result.current.refresh());
  await waitFor(() => expect(result.current.data).toEqual({ projects: [] }));
  expect(result.current.error).toBe("");
});
