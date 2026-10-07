import { act, renderHook, waitFor } from "@testing-library/react-native";
import useResource from "../src/hooks/useResource";
import { fetchResource } from "../src/api/resources";
jest.mock("../src/api/resources", () => ({ fetchResource: jest.fn() }));
beforeEach(() => jest.clearAllMocks());
test("stale server-side filters are aborted without overwriting newer results", async () => {
  let resolveOld;
  fetchResource
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveOld = resolve;
        }),
    )
    .mockResolvedValueOnce({ tasks: ["new"] });
  const { result, rerender } = await renderHook(
    ({ search }) => useResource("/tasks", { search }),
    { initialProps: { search: "old" } },
  );
  const signal = fetchResource.mock.calls[0][2];
  await rerender({ search: "new" });
  await waitFor(() => expect(result.current.data).toEqual({ tasks: ["new"] }));
  expect(signal.aborted).toBe(true);
  await act(async () => resolveOld({ tasks: ["old"] }));
  expect(result.current.data).toEqual({ tasks: ["new"] });
});
test("retry refreshes a failed request without changing its filters", async () => {
  fetchResource
    .mockRejectedValueOnce({ code: "ERR_NETWORK" })
    .mockResolvedValueOnce({ projects: [] });
  const { result } = await renderHook(() =>
    useResource("/projects", { status: "IN_PROGRESS" }),
  );
  await waitFor(() =>
    expect(result.current.error).toBe("No internet connection"),
  );
  await act(() => result.current.refresh());
  await waitFor(() => expect(result.current.data).toEqual({ projects: [] }));
  expect(fetchResource.mock.calls[1][1]).toEqual({ status: "IN_PROGRESS" });
});
