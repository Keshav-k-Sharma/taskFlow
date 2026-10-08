import { AccessibilityInfo, Animated, Text } from "react-native";
import { afterEach } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react-native";
import MotionView from "../src/components/MotionView";

afterEach(() => jest.restoreAllMocks());

test("reduced motion keeps content visible without entrance animation", async () => {
  jest
    .spyOn(AccessibilityInfo, "isReduceMotionEnabled")
    .mockResolvedValue(true);
  const timing = jest.spyOn(Animated, "timing");
  await render(
    <MotionView>
      <Text>Ready</Text>
    </MotionView>,
  );
  expect(screen.getByText("Ready")).toBeTruthy();
  await waitFor(() =>
    expect(AccessibilityInfo.isReduceMotionEnabled).toHaveBeenCalled(),
  );
  expect(timing).not.toHaveBeenCalled();
});

test("animates when permitted and cleans up the animation on unmount", async () => {
  jest
    .spyOn(AccessibilityInfo, "isReduceMotionEnabled")
    .mockResolvedValue(false);
  const animation = { start: jest.fn(), stop: jest.fn() };
  jest.spyOn(Animated, "timing").mockReturnValue(animation);
  const view = await render(
    <MotionView>
      <Text>Ready</Text>
    </MotionView>,
  );
  await waitFor(() => expect(animation.start).toHaveBeenCalled());
  await view.unmount();
  expect(animation.stop).toHaveBeenCalled();
});

test("preference lookup failure safely keeps content available", async () => {
  jest
    .spyOn(AccessibilityInfo, "isReduceMotionEnabled")
    .mockRejectedValue(new Error("Unavailable"));
  const timing = jest.spyOn(Animated, "timing");
  await render(
    <MotionView>
      <Text>Ready</Text>
    </MotionView>,
  );
  expect(screen.getByText("Ready")).toBeTruthy();
  await waitFor(() =>
    expect(AccessibilityInfo.isReduceMotionEnabled).toHaveBeenCalled(),
  );
  expect(timing).not.toHaveBeenCalled();
});
