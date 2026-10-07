import { render, screen, fireEvent } from "@testing-library/react-native";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { Screen } from "../src/components/ui";
test("airplane mode displays the persistent banner and retries connectivity", async () => {
  useNetInfo.mockReturnValueOnce({
    isConnected: false,
    isInternetReachable: false,
  });
  await render(<Screen />);
  expect(screen.getByText("No internet connection")).toBeTruthy();
  await fireEvent.press(
    screen.getByRole("button", { name: "Retry connection" }),
  );
  expect(NetInfo.refresh).toHaveBeenCalled();
});
